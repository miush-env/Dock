import path from "path";
import {
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { s3Client, PUBLIC_URL, resolveBucketName } from "../config/r2.js";
import { isImageFile } from "../utils/fileHelpers.js";

export async function fetchAllFiles() {
  const bucket = await resolveBucketName();
  const command = new ListObjectsV2Command({ Bucket: bucket });
  const response = await s3Client.send(command);
  const contents = response.Contents || [];

  contents.sort((a, b) => {
    const timeA = a.LastModified ? a.LastModified.getTime() : 0;
    const timeB = b.LastModified ? b.LastModified.getTime() : 0;
    return timeB - timeA;
  });

  return contents
    .filter((item) => item.Key && !item.Key.endsWith("/"))
    .map((item) => ({
      name: item.Key,
      url: `${PUBLIC_URL}/${encodeURIComponent(item.Key)}`,
      isImage: isImageFile(item.Key),
      size: item.Size,
      lastModified: item.LastModified,
    }));
}

export async function fetchFilesRoom(roomId) {
  const bucket = await resolveBucketName();
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: `${roomId}/`,
  });
  const res = await s3Client.send(command);
  const contents = res.Contents || [];

  const files = contents
    .filter((item) => item.Key && !item.Key.endsWith("/"))
    .map((item) => {
      const fileName = item.Key.replace(`${roomId}/`, "");

      return {
        name: fileName,
        fullPath: item.Key,
        url: `${PUBLIC_URL}/${encodeURIComponent(item.Key)}`,
        isImage: isImageFile(fileName),
        size: item.Size,
        lastModified: item.LastModified,
        roomId,
      };
    });

  return files;
}

export async function uploadFiles(files, customNamesInput, ownerFiles, roomId) {
  const bucket = await resolveBucketName();
  const rawNames = customNamesInput ? customNamesInput.split(",") : [];
  const uploaded = [];

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const customName = rawNames[index] ? rawNames[index].trim() : "";

    const ext = path.extname(file.originalname);
    const originalBase = path.basename(file.originalname, ext);
    const finalBase = customName !== "" ? customName : originalBase;
    const finalFileName = `${finalBase}${ext}`;
    const key = `${roomId}/${finalFileName}`;

    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Metadata: { owner: ownerFiles },
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "application/octet-stream",
    });

    await s3Client.send(putCommand);

    uploaded.push({
      owner: ownerFiles,
      roomId: roomId,
      name: finalFileName,
      url: `${PUBLIC_URL}/${encodeURIComponent(key)}` | `${PUBLIC_URL}/${key}`,
      isImage: isImageFile(finalFileName),
    });
  }

  return uploaded;
}
