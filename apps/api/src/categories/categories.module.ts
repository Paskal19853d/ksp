import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { ProductEntity } from "../products/entities/product.entity";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
