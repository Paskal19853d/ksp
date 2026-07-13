import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { VideosService } from "./videos.service";
import { CreateVideoDto } from "./dto/create-video.dto";
import { CreateVideoCommentDto } from "./dto/create-video-comment.dto";
import { QueryVideosDto } from "./dto/query-videos.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("videos")
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  findFeed(@Query() query: QueryVideosDto) {
    return this.videosService.findFeed(query);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller", "blogger")
  findMine(@CurrentUser() user: { id: number }) {
    return this.videosService.findByAuthor(user.id);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.videosService.findOne(id);
  }

  @Post(":id/view")
  registerView(@Param("id", ParseIntPipe) id: number) {
    return this.videosService.registerView(id);
  }

  @Get(":id/comments")
  findComments(@Param("id", ParseIntPipe) id: number) {
    return this.videosService.findComments(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller", "blogger")
  create(@CurrentUser() user: { id: number }, @Body() dto: CreateVideoDto) {
    return this.videosService.create(user.id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller", "blogger")
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.videosService.remove(id, user.id);
  }

  @Post(":id/like")
  @UseGuards(JwtAuthGuard)
  toggleLike(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.videosService.toggleLike(id, user.id);
  }

  @Post(":id/comments")
  @UseGuards(JwtAuthGuard)
  addComment(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: CreateVideoCommentDto
  ) {
    return this.videosService.addComment(id, user.id, dto);
  }
}
