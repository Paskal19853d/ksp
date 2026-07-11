import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";

// Per-connection viewer tracking so a disconnect always removes exactly what
// that socket added, even across multiple tabs/reconnects for the same user.
const VIEWER_KEY_TTL_SECONDS = 6 * 3600;

@Injectable()
export class StreamPresenceService {
  constructor(private readonly redisService: RedisService) {}

  private viewersKey(streamId: number) {
    return `stream:${streamId}:viewers`;
  }

  async join(streamId: number, socketId: string): Promise<number> {
    const key = this.viewersKey(streamId);
    await this.redisService.client.sadd(key, socketId);
    await this.redisService.client.expire(key, VIEWER_KEY_TTL_SECONDS);
    return this.redisService.client.scard(key);
  }

  async leave(streamId: number, socketId: string): Promise<number> {
    const key = this.viewersKey(streamId);
    await this.redisService.client.srem(key, socketId);
    return this.redisService.client.scard(key);
  }

  count(streamId: number): Promise<number> {
    return this.redisService.client.scard(this.viewersKey(streamId));
  }
}
