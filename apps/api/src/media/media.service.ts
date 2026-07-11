import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { StorageService } from "./storage.service";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "./media.constants";
import { PresignUploadDto } from "./dto/presign-upload.dto";

@Injectable()
export class MediaService {
  constructor(private readonly storageService: StorageService) {}

  async presignUpload(userId: number, dto: PresignUploadDto) {
    if (!ALLOWED_MIME_TYPES[dto.kind].includes(dto.mimeType)) {
      throw new BadRequestException(
        `Тип файлу ${dto.mimeType} не підтримується для ${dto.kind}`
      );
    }

    if (dto.sizeBytes > MAX_FILE_SIZE_BYTES[dto.kind]) {
      const maxMb = Math.round(MAX_FILE_SIZE_BYTES[dto.kind] / (1024 * 1024));
      throw new BadRequestException(`Розмір файлу перевищує ліміт ${maxMb} МБ`);
    }

    if (!this.storageService.isConfigured) {
      throw new ServiceUnavailableException(
        "Завантаження медіа тимчасово недоступне — сховище не налаштоване"
      );
    }

    const extension = dto.fileName.includes(".") ? dto.fileName.split(".").pop() : "";
    const objectKey = `${dto.kind}s/${userId}/${randomUUID()}${extension ? `.${extension}` : ""}`;

    return this.storageService.createPresignedUploadUrl(objectKey, dto.mimeType);
  }
}
