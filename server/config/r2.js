import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

let cachedBucket = process.env.R2_BUCKET_NAME || "dock-files";

export async function resolveBucketName() {
  try {
    const res = await s3Client.send(new ListBucketsCommand({}));
    if (res.Buckets && res.Buckets.length > 0) {
      const match = res.Buckets.find((b) => b.Name === cachedBucket);
      if (match?.Name) return match.Name;
      if (res.Buckets[0].Name) {
        cachedBucket = res.Buckets[0].Name;
        return cachedBucket;
      }
    }
  } catch (err) {
    // Si la credencial no tiene permisos para listar buckets, se usa el configurado por defecto
  }
  return cachedBucket;
}
