import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatMessageEntity } from "./entities/chat-message.entity";

const FLUSH_INTERVAL_MS = 3000;
const MAX_BUFFER_SIZE = 500;

interface PendingMessage {
  streamId: number;
  authorId: number;
  text: string;
}

@Injectable()
export class ChatPersistenceService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ChatPersistenceService.name);
  private buffer: PendingMessage[] = [];
  private flushTimer: ReturnType<typeof setInterval>;

  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly chatMessagesRepository: Repository<ChatMessageEntity>
  ) {}

  onModuleInit() {
    this.flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);
  }

  async onModuleDestroy() {
    clearInterval(this.flushTimer);
    await this.flush();
  }

  // Called from the gateway's hot path — never awaited by the broadcast,
  // so a slow/failed DB write can't add latency to message fan-out.
  enqueue(message: PendingMessage) {
    this.buffer.push(message);
    if (this.buffer.length >= MAX_BUFFER_SIZE) {
      void this.flush();
    }
  }

  async findRecent(streamId: number, limit = 50) {
    // Secondary sort by id: batched inserts can share the exact same createdAt
    // timestamp, so createdAt alone doesn't give a stable/deterministic order.
    return this.chatMessagesRepository.find({
      where: { streamId },
      order: { createdAt: "DESC", id: "DESC" },
      take: limit,
    });
  }

  private async flush() {
    if (this.buffer.length === 0) {
      return;
    }
    const batch = this.buffer;
    this.buffer = [];

    try {
      const entities = batch.map((m) => this.chatMessagesRepository.create(m));
      await this.chatMessagesRepository.save(entities);
    } catch (err) {
      this.logger.error(`Failed to persist ${batch.length} chat messages: ${(err as Error).message}`);
    }
  }
}
