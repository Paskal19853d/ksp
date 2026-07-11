import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReplyReviewDto } from "./dto/reply-review.dto";
import { QueryReviewsDto } from "./dto/query-reviews.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findByProduct(@Query() query: QueryReviewsDto) {
    return this.reviewsService.findByProduct(query);
  }

  @Get("seller")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller")
  findForSeller(@CurrentUser() user: { id: number }) {
    return this.reviewsService.findBySeller(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: { id: number }, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @Patch(":id/reply")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller")
  reply(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: ReplyReviewDto
  ) {
    return this.reviewsService.reply(id, user.id, dto.reply);
  }
}
