import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { RealtimeGateway } from "./realtime.gateway";
import { StreamPresenceService } from "./stream-presence.service";
import { ChatPersistenceService } from "./chat-persistence.service";
import { ChatMessageEntity } from "./entities/chat-message.entity";

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([ChatMessageEntity])],
  providers: [RealtimeGateway, StreamPresenceService, ChatPersistenceService],
  exports: [RealtimeGateway, StreamPresenceService, ChatPersistenceService],
})
export class RealtimeModule {}
