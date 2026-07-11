import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { QueryProductsDto } from "./dto/query-products.dto";
import { CategoriesService } from "../categories/categories.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    private readonly categoriesService: CategoriesService
  ) {}

  async findAll(query: QueryProductsDto) {
    const qb = this.productsRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoin("product.seller", "seller")
      .addSelect(["seller.id", "seller.name", "seller.avatarUrl"])
      .where("product.active = :active", { active: true });

    if (query.categoryId) {
      qb.andWhere("product.categoryId = :categoryId", { categoryId: query.categoryId });
    }

    if (query.search) {
      qb.andWhere(`product."searchVector" @@ websearch_to_tsquery('simple', :search)`, {
        search: query.search,
      });
      qb.addSelect(
        `ts_rank(product."searchVector", websearch_to_tsquery('simple', :search))`,
        "rank"
      );
      qb.orderBy("rank", "DESC");
    } else {
      qb.orderBy("product.createdAt", "DESC");
    }

    const [items, total] = await qb.take(query.limit).skip(query.offset).getManyAndCount();

    return { items, total, limit: query.limit, offset: query.offset };
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { category: true, seller: true },
      select: {
        seller: { id: true, name: true, avatarUrl: true, blocked: true },
      },
    });
    if (!product) {
      throw new NotFoundException("Товар не знайдено");
    }
    return product;
  }

  findBySeller(sellerId: number) {
    return this.productsRepository.find({
      where: { sellerId },
      relations: { category: true },
      order: { createdAt: "DESC" },
    });
  }

  async create(sellerId: number, dto: CreateProductDto) {
    await this.categoriesService.findOne(dto.categoryId);
    const product = this.productsRepository.create({ ...dto, sellerId });
    return this.productsRepository.save(product);
  }

  async update(id: number, currentUserId: number, dto: UpdateProductDto) {
    const product = await this.findOwnedOrThrow(id, currentUserId);
    if (dto.categoryId) {
      await this.categoriesService.findOne(dto.categoryId);
    }
    Object.assign(product, dto);
    return this.productsRepository.save(product);
  }

  async remove(id: number, currentUserId: number) {
    const product = await this.findOwnedOrThrow(id, currentUserId);
    await this.productsRepository.remove(product);
  }

  private async findOwnedOrThrow(id: number, currentUserId: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException("Товар не знайдено");
    }
    if (product.sellerId !== currentUserId) {
      throw new ForbiddenException("Ви не можете редагувати цей товар");
    }
    return product;
  }
}
