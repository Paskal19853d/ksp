export const MEDIA_KIND = ["image", "video"] as const;
export type MediaKind = (typeof MEDIA_KIND)[number];

export const ALLOWED_MIME_TYPES: Record<MediaKind, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp"],
  video: ["video/mp4", "video/quicktime"],
};

export const MAX_FILE_SIZE_BYTES: Record<MediaKind, number> = {
  image: 10 * 1024 * 1024, // 10 MB
  video: 200 * 1024 * 1024, // 200 MB
};

export const PRESIGNED_URL_EXPIRY_SECONDS = 300;
