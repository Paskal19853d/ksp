import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { QueryProductsDto } from "./dto/query-products.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller")
  findMine(@CurrentUser() user: { id: number }) {
    return this.productsService.findBySeller(user.id);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller")
  create(
    @CurrentUser() user: { id: number; sellerStatus?: string | null },
    @Body() dto: CreateProductDto
  ) {
    if (user.sellerStatus !== "approved") {
      throw new ForbiddenException(
        user.sellerStatus === "rejected"
          ? "Заявку на продаж відхилено"
          : "Ваш акаунт продавця ще не підтверджено адміністратором"
      );
    }
    return this.productsService.create(user.id, dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller")
  update(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateProductDto
  ) {
    return this.productsService.update(id, user.id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller")
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.productsService.remove(id, user.id);
  }
}
