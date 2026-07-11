import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { StreamsService } from "./streams.service";
import { CreateStreamDto } from "./dto/create-stream.dto";
import { UpdateStreamDto } from "./dto/update-stream.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ChatPersistenceService } from "../realtime/chat-persistence.service";

@Controller("streams")
export class StreamsController {
  constructor(
    private readonly streamsService: StreamsService,
    private readonly chatPersistenceService: ChatPersistenceService
  ) {}

  @Get("live")
  findLive() {
    return this.streamsService.findLive();
  }

  @Get("my")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller")
  findMine(@CurrentUser() user: { id: number }) {
    return this.streamsService.findByHost(user.id);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.streamsService.findOne(id);
  }

  @Get(":id/chat")
  async findChatHistory(@Param("id", ParseIntPipe) id: number) {
    const messages = await this.chatPersistenceService.findRecent(id);
    return messages.reverse();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller")
  create(@CurrentUser() user: { id: number }, @Body() dto: CreateStreamDto) {
    return this.streamsService.create(user.id, dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller")
  update(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateStreamDto
  ) {
    return this.streamsService.update(id, user.id, dto);
  }

  @Patch(":id/start")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller")
  start(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.streamsService.start(id, user.id);
  }

  @Patch(":id/end")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("seller")
  end(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.streamsService.end(id, user.id);
  }
}
