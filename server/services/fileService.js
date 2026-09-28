import path from "path";
import {
  PutObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client, PUBLIC_URL, resolveBucketName } from "../config/r2.js";
import { isImageFile, formatFileSize } from "../utils/fileHelpers.js";

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
      formattedSize: formatFileSize(item.Size),
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

  const validItems = contents.filter((item) => item.Key && !item.Key.endsWith("/"));

  // Obtener metadata de cada archivo (incluye el propietario guardado en R2)
  const files = await Promise.all(
    validItems.map(async (item) => {
      const fileName = item.Key.replace(`${roomId}/`, "");
      let owner = "Anónimo";

      try {
        const headCmd = new HeadObjectCommand({
          Bucket: bucket,
          Key: item.Key,
        });
        const headRes = await s3Client.send(headCmd);
        if (headRes.Metadata && headRes.Metadata.owner) {
          owner = headRes.Metadata.owner;
        }
      } catch (err) {
        console.warn(`No se pudo leer metadata de ${item.Key}:`, err.message);
      }

      return {
        name: fileName,
        owner,
        fullPath: item.Key,
        url: `${PUBLIC_URL}/${encodeURIComponent(item.Key)}`,
        isImage: isImageFile(fileName),
        size: item.Size,
        formattedSize: formatFileSize(item.Size),
        lastModified: item.LastModified,
        roomId,
      };
    })
  );

  return files;
}

export async function uploadFiles(files, customNamesInput, ownerFiles, roomId) {
  const bucket = await resolveBucketName();
  const rawNames = customNamesInput ? customNamesInput.split(",") : [];
  const uploaded = [];
  const finalOwner = (ownerFiles && ownerFiles.trim()) || "Anónimo";

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
      Metadata: { owner: finalOwner },
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "application/octet-stream",
    });

    await s3Client.send(putCommand);

    uploaded.push({
      owner: finalOwner,
      roomId: roomId,
      name: finalFileName,
      url: `${PUBLIC_URL}/${encodeURIComponent(key)}`,
      size: file.size,
      formattedSize: formatFileSize(file.size),
      isImage: isImageFile(finalFileName),
    });
  }

  return uploaded;
}

export async function deleteFileFromRoom(roomId, fileName) {
  const bucket = await resolveBucketName();
  const key = `${roomId}/${fileName}`;

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await s3Client.send(command);
  return { success: true, key };
}

export async function renameFileInRoom(roomId, oldFileName, newFileName) {
  const bucket = await resolveBucketName();
  const oldKey = `${roomId}/${oldFileName}`;

  // Mantener extensión original si el usuario no la escribió
  const oldExt = path.extname(oldFileName);
  let targetName = newFileName.trim();
  if (oldExt && !targetName.endsWith(oldExt)) {
    targetName = `${targetName}${oldExt}`;
  }
  const newKey = `${roomId}/${targetName}`;

  if (oldKey === newKey) {
    return { success: true, newName: targetName };
  }

  // 1. Obtener metadata original (para no perder el dueño)
  let metadata = {};
  let contentType = "application/octet-stream";
  try {
    const head = await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: oldKey }));
    metadata = head.Metadata || {};
    contentType = head.ContentType || contentType;
  } catch (err) {
    console.warn("No se pudo obtener metadata previa al renombrar:", err.message);
  }

  // 2. Copiar objeto a la nueva clave en R2
  const copyCommand = new CopyObjectCommand({
    Bucket: bucket,
    CopySource: `${bucket}/${encodeURIComponent(oldKey)}`,
    Key: newKey,
    Metadata: metadata,
    MetadataDirective: "REPLACE",
    ContentType: contentType,
  });
  await s3Client.send(copyCommand);

  // 3. Eliminar objeto anterior
  await s3Client.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: oldKey,
  }));

  return {
    success: true,
    newName: targetName,
    newUrl: `${PUBLIC_URL}/${encodeURIComponent(newKey)}`,
  };
}
