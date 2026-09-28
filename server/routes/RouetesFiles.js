

// Endpoint para obtener todos los archivos recibidos desde Cloudflare R2
app.get("/files", async (req, res) => {
  try {
    const bucket = await getBucketName();
    const command = new ListObjectsV2Command({
      Bucket: bucket,
    });

    const response = await s3Client.send(command);
    const contents = response.Contents || [];

    // Ordenar los más recientes primero
    contents.sort(
      (a, b) => (b.LastModified ? b.LastModified.getTime() : 0) - (a.LastModified ? a.LastModified.getTime() : 0)
    );

    const fileList = contents
      .filter((item) => item.Key && !item.Key.endsWith("/"))
      .map((item) => {
        const fileName = item.Key;
        const fileUrl = `${PUBLIC_URL}/${encodeURIComponent(fileName)}`;
        return {
          name: fileName,
          url: fileUrl,
          isImage: isImageFile(fileName),
          size: item.Size,
          lastModified: item.LastModified,
        };
      });

    res.json(fileList);
  } catch (error) {
    console.error("Error al listar archivos desde R2:", error);
    res.status(500).json({ error: "Error al listar archivos desde Cloudflare R2" });
  }
});

// Endpoint para subir múltiples archivos a Cloudflare R2
app.post("/sendFiles", upload.array("image", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No se enviaron archivos" });
    }

    const bucket = await getBucketName();
    const rawNames = req.body.fileName ? req.body.fileName.split(",") : [];
    const uploaded = [];

    for (let index = 0; index < req.files.length; index++) {
      const file = req.files[index];
      const customName = rawNames[index] ? rawNames[index].trim() : "";

      const ext = path.extname(file.originalname);
      const originalBase = path.basename(file.originalname, ext);
      const finalBase = customName !== "" ? customName : originalBase;
      const finalFileName = `${finalBase}${ext}`;

      const putCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: finalFileName,
        Body: file.buffer,
        ContentType: file.mimetype || "application/octet-stream",
      });

      await s3Client.send(putCommand);

      const fileUrl = `${PUBLIC_URL}/${encodeURIComponent(finalFileName)}`;
      uploaded.push({
        name: finalFileName,
        url: fileUrl,
        isImage: isImageFile(finalFileName),
      });
    }

    console.log("Archivos subidos exitosamente a R2:", uploaded);
    res.json({ message: "Files uploaded", files: uploaded });
  } catch (error) {
    console.error("Error subiendo archivos a R2:", error);
    res.status(500).json({ error: "Error al subir archivos a Cloudflare R2" });
  }
});
