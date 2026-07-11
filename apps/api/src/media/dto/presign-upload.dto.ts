import { IsIn, IsInt, IsString, Max, MaxLength, Min } from "class-validator";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, MEDIA_KIND, MediaKind } from "../media.constants";

const ALL_ALLOWED_MIME_TYPES = [...ALLOWED_MIME_TYPES.image, ...ALLOWED_MIME_TYPES.video];
const MAX_ALLOWED_SIZE_BYTES = Math.max(...Object.values(MAX_FILE_SIZE_BYTES));

export class PresignUploadDto {
  @IsIn(MEDIA_KIND)
  kind: MediaKind;

  @IsIn(ALL_ALLOWED_MIME_TYPES)
  mimeType: string;

  @IsInt()
  @Min(1)
  @Max(MAX_ALLOWED_SIZE_BYTES)
  sizeBytes: number;

  @IsString()
  @MaxLength(200)
  fileName: string;
}
