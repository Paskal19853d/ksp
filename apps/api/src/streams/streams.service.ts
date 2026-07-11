import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StreamEntity } from "./entities/stream.entity";
import { CreateStreamDto } from "./dto/create-stream.dto";
import { UpdateStreamDto } from "./dto/update-stream.dto";
import { ProductsService } from "../products/products.service";

@Injectable()
export class StreamsService {
  constructor(
    @InjectRepository(StreamEntity)
    private readonly streamsRepository: Repository<StreamEntity>,
    private readonly productsService: ProductsService
  ) {}

  async create(hostId: number, dto: CreateStreamDto) {
    await this.assertOwnsProducts(hostId, dto.productIds ?? []);

    const stream = this.streamsRepository.create({
      hostId,
      title: dto.title,
      description: dto.description ?? "",
      productIds: dto.productIds ?? [],
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      status: "scheduled",
    });
    return this.streamsRepository.save(stream);
  }

  findLive() {
    return this.streamsRepository.find({
      where: { status: "live" },
      order: { startedAt: "DESC" },
    });
  }

  findLiveFeaturingProduct(productId: number) {
    return this.streamsRepository
      .createQueryBuilder("stream")
      .where("stream.status = :status", { status: "live" })
      .andWhere(":productId = ANY(stream.productIds)", { productId })
      .getMany();
  }

  async findOne(id: number) {
    const stream = await this.streamsRepository.findOne({ where: { id } });
    if (!stream) {
      throw new NotFoundException("Ефір не знайдено");
    }
    return stream;
  }

  findByHost(hostId: number) {
    return this.streamsRepository.find({
      where: { hostId },
      order: { createdAt: "DESC" },
    });
  }

  async update(id: number, hostId: number, dto: UpdateStreamDto) {
    const stream = await this.findOwnedOrThrow(id, hostId);
    if (stream.status !== "scheduled") {
      throw new BadRequestException("Можна редагувати лише заплановані ефіри");
    }
    if (dto.productIds) {
      await this.assertOwnsProducts(hostId, dto.productIds);
    }
    Object.assign(stream, {
      ...dto,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : stream.scheduledAt,
    });
    return this.streamsRepository.save(stream);
  }

  async start(id: number, hostId: number) {
    const stream = await this.findOwnedOrThrow(id, hostId);
    if (stream.status !== "scheduled") {
      throw new BadRequestException("Ефір вже розпочато або завершено");
    }
    stream.status = "live";
    stream.startedAt = new Date();
    return this.streamsRepository.save(stream);
  }

  // Viewer/order/income snapshot filled in with real numbers once the Redis viewer
  // counter (step 4) and stream-scoped order tracking (step 7) exist; until then
  // ending a stream just closes it out at zero, which is honest given nothing
  // upstream produces these numbers yet.
  async end(id: number, hostId: number, finalStats?: { peakViewers: number; ordersCount: number; income: number }) {
    const stream = await this.findOwnedOrThrow(id, hostId);
    if (stream.status !== "live") {
      throw new BadRequestException("Ефір не в прямому ефірі");
    }
    stream.status = "ended";
    stream.endedAt = new Date();
    stream.peakViewers = finalStats?.peakViewers ?? 0;
    stream.ordersCount = finalStats?.ordersCount ?? 0;
    stream.income = finalStats?.income ?? 0;
    return this.streamsRepository.save(stream);
  }

  private async findOwnedOrThrow(id: number, hostId: number) {
    const stream = await this.streamsRepository.findOne({ where: { id } });
    if (!stream) {
      throw new NotFoundException("Ефір не знайдено");
    }
    if (stream.hostId !== hostId) {
      throw new ForbiddenException("Ви не можете керувати цим ефіром");
    }
    return stream;
  }

  private async assertOwnsProducts(sellerId: number, productIds: number[]) {
    for (const productId of productIds) {
      const product = await this.productsService.findOne(productId);
      if (product.sellerId !== sellerId) {
        throw new ForbiddenException(`Товар #${productId} не належить вам`);
      }
    }
  }
}
