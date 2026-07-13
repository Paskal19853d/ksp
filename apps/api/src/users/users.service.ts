import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { ProductEntity } from "../products/entities/product.entity";
import { SellerStatsService } from "../orders/seller-stats.service";
import { QueryUsersDto } from "./dto/query-users.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    private readonly sellerStatsService: SellerStatsService
  ) {}

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email: email.toLowerCase() } });
  }

  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  create(data: { name: string; email: string; passwordHash: string; role: UserEntity["role"] }) {
    const user = this.usersRepository.create({
      ...data,
      email: data.email.toLowerCase(),
      sellerStatus: data.role === "seller" ? "pending" : undefined,
    });
    return this.usersRepository.save(user);
  }

  private sanitize(user: UserEntity) {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  countAll() {
    return this.usersRepository.count();
  }

  countByRole(role: UserEntity["role"]) {
    return this.usersRepository.count({ where: { role } });
  }

  async findAllForAdmin(query: QueryUsersDto) {
    const qb = this.usersRepository.createQueryBuilder("user").orderBy("user.createdAt", "DESC");

    if (query.role) {
      qb.andWhere("user.role = :role", { role: query.role });
    }
    if (query.search) {
      qb.andWhere("(user.name ILIKE :search OR user.email ILIKE :search)", {
        search: `%${query.search}%`,
      });
    }

    const [items, total] = await qb
      .take(query.limit)
      .skip(query.offset)
      .getManyAndCount();

    return { items: items.map((u) => this.sanitize(u)), total, limit: query.limit, offset: query.offset };
  }

  async setBlocked(id: number, blocked: boolean) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("Користувача не знайдено");
    }
    user.blocked = blocked;
    const saved = await this.usersRepository.save(user);
    return this.sanitize(saved);
  }

  async findPendingSellers() {
    const sellers = await this.usersRepository.find({
      where: { role: "seller", sellerStatus: "pending" },
      order: { createdAt: "ASC" },
    });
    return sellers.map((u) => this.sanitize(u));
  }

  async findAllSellersForAdmin() {
    const sellers = await this.usersRepository.find({
      where: { role: "seller" },
      order: { createdAt: "DESC" },
    });
    const sellerIds = sellers.map((s) => s.id);

    const revenueTotals = await this.sellerStatsService.getRevenueTotals(sellerIds);

    const productStats = await this.productsRepository
      .createQueryBuilder("product")
      .select("product.sellerId", "sellerId")
      .addSelect("COUNT(*)", "count")
      .addSelect("AVG(product.rating)", "avgRating")
      .where("product.sellerId IN (:...sellerIds)", { sellerIds: sellerIds.length ? sellerIds : [0] })
      .groupBy("product.sellerId")
      .getRawMany<{ sellerId: number; count: string; avgRating: string }>();
    const productStatsById = new Map(
      productStats.map((p) => [p.sellerId, { count: Number(p.count), avgRating: Number(p.avgRating) }])
    );

    return sellers.map((seller) => ({
      ...this.sanitize(seller),
      revenue: revenueTotals.get(seller.id)?.revenue ?? 0,
      orderCount: revenueTotals.get(seller.id)?.orderCount ?? 0,
      productCount: productStatsById.get(seller.id)?.count ?? 0,
      rating: productStatsById.get(seller.id)?.avgRating ?? 0,
    }));
  }

  async resolveSeller(id: number, status: "approved" | "rejected") {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user || user.role !== "seller") {
      throw new NotFoundException("Продавця не знайдено");
    }
    user.sellerStatus = status;
    const saved = await this.usersRepository.save(user);
    return this.sanitize(saved);
  }
}
