import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  // Separate connections: a subscribed connection can't issue normal commands,
  // and the Socket.IO adapter needs its own dedicated pub/sub pair.
  readonly client: Redis;
  readonly pubClient: Redis;
  readonly subClient: Redis;

  constructor() {
    const options = {
      host: process.env.REDIS_HOST ?? "redis",
      port: Number(process.env.REDIS_PORT ?? 6379),
    };
    this.client = new Redis(options);
    this.pubClient = new Redis(options);
    this.subClient = new Redis(options);

    this.client.on("error", (err) => this.logger.error(`Redis client error: ${err.message}`));
    this.pubClient.on("error", (err) => this.logger.error(`Redis pub client error: ${err.message}`));
    this.subClient.on("error", (err) => this.logger.error(`Redis sub client error: ${err.message}`));
  }

  async onModuleDestroy() {
    await Promise.all([this.client.quit(), this.pubClient.quit(), this.subClient.quit()]);
  }
}
