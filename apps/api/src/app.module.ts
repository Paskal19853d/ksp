import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CategoriesModule } from "./categories/categories.module";
import { ProductsModule } from "./products/products.module";
import { MediaModule } from "./media/media.module";
import { OrdersModule } from "./orders/orders.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { RedisModule } from "./redis/redis.module";
import { RealtimeModule } from "./realtime/realtime.module";
import { StreamsModule } from "./streams/streams.module";

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RedisModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST ?? "db",
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? "treetex",
      password: process.env.DB_PASSWORD ?? "treetex",
      database: process.env.DB_NAME ?? "treetex",
      autoLoadEntities: true,
      synchronize: false,
      migrations: [`${__dirname}/migrations/*.{ts,js}`],
      migrationsRun: true,
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    MediaModule,
    OrdersModule,
    ReviewsModule,
    RealtimeModule,
    StreamsModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
