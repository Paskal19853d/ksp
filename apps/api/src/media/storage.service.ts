import { Injectable, Logger } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PRESIGNED_URL_EXPIRY_SECONDS } from "./media.constants";

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client | null;
  private readonly bucket = process.env.S3_BUCKET ?? "";
  private readonly publicBaseUrl = process.env.S3_PUBLIC_BASE_URL ?? "";

  constructor() {
    const endpoint = process.env.S3_ENDPOINT;
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

    if (!endpoint || !accessKeyId || !secretAccessKey || !this.bucket) {
      this.logger.warn(
        "S3 credentials are not configured — media uploads are disabled until S3_ENDPOINT/S3_ACCESS_KEY_ID/S3_SECRET_ACCESS_KEY/S3_BUCKET are set in .env"
      );
      this.client = null;
      return;
    }

    this.client = new S3Client({
      endpoint,
      region: process.env.S3_REGION ?? "auto",
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    });
  }

  get isConfigured() {
    return this.client !== null;
  }

  async createPresignedUploadUrl(objectKey: string, contentType: string) {
    if (!this.client) {
      throw new Error("Storage is not configured");
    }
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: PRESIGNED_URL_EXPIRY_SECONDS,
    });
    const publicUrl = this.publicBaseUrl
      ? `${this.publicBaseUrl.replace(/\/$/, "")}/${objectKey}`
      : `${this.bucket}/${objectKey}`;
    return { uploadUrl, publicUrl, expiresIn: PRESIGNED_URL_EXPIRY_SECONDS };
  }
}
