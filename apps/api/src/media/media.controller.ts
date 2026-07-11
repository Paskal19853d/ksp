import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { MediaService } from "./media.service";
import { PresignUploadDto } from "./dto/presign-upload.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("media")
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("presign")
  presign(@CurrentUser() user: { id: number }, @Body() dto: PresignUploadDto) {
    return this.mediaService.presignUpload(user.id, dto);
  }
}
