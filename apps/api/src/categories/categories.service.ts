import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { ProductEntity } from "../products/entities/product.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>
  ) {}

  findAll(includeHidden = false) {
    return this.categoriesRepository.find({
      where: includeHidden ? {} : { visible: true },
      order: { id: "ASC" },
    });
  }

  async findAllForAdmin() {
    const categories = await this.categoriesRepository.find({ order: { id: "ASC" } });
    const counts = await this.productsRepository
      .createQueryBuilder("product")
      .select("product.categoryId", "categoryId")
      .addSelect("COUNT(*)", "count")
      .where("product.active = :active", { active: true })
      .groupBy("product.categoryId")
      .getRawMany<{ categoryId: number; count: string }>();

    const countByCategory = new Map(counts.map((c) => [c.categoryId, Number(c.count)]));

    return categories.map((category) => ({
      ...category,
      productCount: countByCategory.get(category.id) ?? 0,
    }));
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException("Категорію не знайдено");
    }
    return category;
  }

  create(dto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(dto);
    return this.categoriesRepository.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }
}
