import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PageEntity } from "./entities/page.entity";
import { CmsService } from "./cms.service";
import { CmsController } from "./cms.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PageEntity])],
  providers: [CmsService],
  controllers: [CmsController],
  exports: [CmsService],
})
export class CmsModule {}
