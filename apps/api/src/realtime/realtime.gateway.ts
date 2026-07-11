import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { createAdapter } from "@socket.io/redis-adapter";
import * as cookie from "cookie";
import { Server, Socket } from "socket.io";
import { RedisService } from "../redis/redis.service";
import { UsersService } from "../users/users.service";
import { StreamPresenceService } from "./stream-presence.service";
import { ChatPersistenceService } from "./chat-persistence.service";

export interface AuthenticatedSocket extends Socket {
  data: {
    user: { id: number; role: string; name: string };
    joinedStreamId?: number;
  };
}

function streamRoom(streamId: number) {
  return `stream:${streamId}`;
}

@WebSocketGateway({
  cors: {
    origin: (process.env.WEB_ORIGIN ?? "http://localhost:3000").split(","),
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly streamPresenceService: StreamPresenceService,
    private readonly chatPersistenceService: ChatPersistenceService
  ) {}

  afterInit(server: Server) {
    server.adapter(createAdapter(this.redisService.pubClient, this.redisService.subClient));

    // Auth must run as handshake middleware, not in handleConnection: by the time
    // handleConnection fires, the client has already received its "connect" event,
    // so disconnecting there is too late to prevent a false-positive connect on the client.
    server.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const user = await this.authenticate(socket);
        socket.data.user = user;
        next();
      } catch (err) {
        next(err instanceof Error ? err : new Error("Unauthorized"));
      }
    });

    this.logger.log("WebSocket gateway initialized with Redis adapter");
  }

  handleConnection(socket: AuthenticatedSocket) {
    this.logger.debug(`Client connected: ${socket.id} (user ${socket.data.user?.id})`);
  }

  async handleDisconnect(socket: AuthenticatedSocket) {
    if (socket.data.joinedStreamId != null) {
      await this.leaveStream(socket, socket.data.joinedStreamId);
    }
  }

  @SubscribeMessage("stream:join")
  async onStreamJoin(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() data: { streamId: number }
  ) {
    const streamId = Number(data?.streamId);
    if (!Number.isInteger(streamId) || streamId <= 0) {
      return;
    }
    if (socket.data.joinedStreamId === streamId) {
      return;
    }
    if (socket.data.joinedStreamId != null) {
      await this.leaveStream(socket, socket.data.joinedStreamId);
    }

    await socket.join(streamRoom(streamId));
    socket.data.joinedStreamId = streamId;
    const count = await this.streamPresenceService.join(streamId, socket.id);
    this.server.to(streamRoom(streamId)).emit("stream:viewers", { streamId, count });
  }

  @SubscribeMessage("stream:leave")
  async onStreamLeave(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() data: { streamId: number }
  ) {
    const streamId = Number(data?.streamId);
    if (socket.data.joinedStreamId !== streamId) {
      return;
    }
    await this.leaveStream(socket, streamId);
  }

  @SubscribeMessage("stream:chat:send")
  onChatSend(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() data: { streamId: number; text: string }
  ) {
    const streamId = Number(data?.streamId);
    const text = typeof data?.text === "string" ? data.text.trim() : "";

    // Must actually be in the room they're posting to — prevents spoofing
    // messages into streams the socket never joined.
    if (socket.data.joinedStreamId !== streamId) {
      return;
    }
    if (!text || text.length > 500) {
      return;
    }

    const message = {
      streamId,
      authorId: socket.data.user.id,
      authorName: socket.data.user.name,
      text,
      sentAt: new Date().toISOString(),
    };
    this.server.to(streamRoom(streamId)).emit("stream:chat:message", message);

    // Buffered, not awaited — persistence must never add latency to fan-out.
    this.chatPersistenceService.enqueue({ streamId, authorId: socket.data.user.id, text });
  }

  broadcastStockUpdate(streamId: number, productId: number, stock: number) {
    this.server.to(streamRoom(streamId)).emit("stream:product:stock", { streamId, productId, stock });
  }

  private async leaveStream(socket: AuthenticatedSocket, streamId: number) {
    // Broadcast (and let the leaving socket receive it) before actually leaving
    // the room — once socket.leave() runs, this socket stops receiving room
    // broadcasts, so it would never learn the post-leave count otherwise.
    const count = await this.streamPresenceService.leave(streamId, socket.id);
    this.server.to(streamRoom(streamId)).emit("stream:viewers", { streamId, count });
    await socket.leave(streamRoom(streamId));
    socket.data.joinedStreamId = undefined;
  }

  private async authenticate(socket: Socket) {
    const rawCookie = socket.handshake.headers.cookie;
    if (!rawCookie) {
      throw new Error("No cookie header");
    }
    const parsed = cookie.parse(rawCookie);
    const token = parsed["access_token"];
    if (!token) {
      throw new Error("No access_token cookie");
    }

    const payload = this.jwtService.verify<{ sub: number; role: string }>(token);
    const user = await this.usersService.findById(payload.sub);
    if (!user || user.blocked) {
      throw new Error("User not found or blocked");
    }
    return { id: user.id, role: user.role, name: user.name };
  }
}
