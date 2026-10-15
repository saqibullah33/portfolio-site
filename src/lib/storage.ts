import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const region = process.env.AWS_REGION;
const bucket = process.env.NEON_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export const s3Enabled = Boolean(
  endpoint && region && bucket && accessKeyId && secretAccessKey
);

let _client: S3Client | null = null;
function s3(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
      forcePathStyle: true,
      requestChecksumCalculation: "WHEN_REQUIRED",
    });
  }
  return _client;
}

/** Public URL for an object in a public_read bucket: {endpoint}/{bucket}/{key} */
function publicUrl(key: string): string {
  return `${endpoint!.replace(/\/$/, "")}/${bucket}/${key}`;
}

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
};

export function extFor(mime: string): string | null {
  return ALLOWED[mime] ?? null;
}

/**
 * Store a file for an event. Uses Neon Object Storage when AWS_* + NEON_BUCKET
 * are configured, otherwise falls back to public/uploads on local disk.
 * Returns the URL to store in the DB.
 */
export async function storeFile(
  eventId: number,
  file: File
): Promise<{ url: string; backend: "neon" | "local" }> {
  const ext = extFor(file.type);
  if (!ext) throw new Error(`Unsupported type ${file.type}`);
  const key = `events/${eventId}/${crypto.randomUUID()}${ext}`;

  if (s3Enabled) {
    await s3().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
      })
    );
    return { url: publicUrl(key), backend: "neon" };
  }

  const name = `${eventId}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${name}`, backend: "local" };
}

/** Best-effort delete of the underlying object for a stored media URL. */
export async function removeFile(url: string): Promise<void> {
  if (s3Enabled && url.startsWith(`${endpoint!.replace(/\/$/, "")}/${bucket}/`)) {
    const key = url.slice(`${endpoint!.replace(/\/$/, "")}/${bucket}/`.length);
    await s3()
      .send(new DeleteObjectCommand({ Bucket: bucket, Key: decodeURIComponent(key) }))
      .catch(() => {});
    return;
  }
  if (url.startsWith("/uploads/")) {
    await unlink(path.join(process.cwd(), "public", url)).catch(() => {});
  }
}
