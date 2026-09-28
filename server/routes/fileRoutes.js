import { Router } from "express";
import multer from "multer";
import { fetchAllFiles, fetchFilesRoom, uploadFiles } from "../services/fileService.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/files", async (req, res) => {
  try {
    const files = await fetchAllFiles();
    res.json(files);
  } catch (error) {
    console.error("Error al obtener archivos:", error);
    res.status(500).json({ error: "Error al listar archivos desde Cloudflare R2" });
  }
});

router.get("/:roomId", async (req, res) => {
  try {
    const files = await fetchFilesRoom(req.params.roomId);
    res.json(files);
  } catch (error) {
    console.error("Error al obtener archivos:", error);
    res.status(500).json({ error: "Error al listar archivos desde Cloudflare R2" });
  }
});

router.post("/sendFiles", upload.array("image", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No se enviaron archivos" });
    }

    const uploaded = await uploadFiles(req.files, req.body.fileName, req.body.ownerFiles, req.body.roomId);
    res.json({ message: "Files uploaded", files: uploaded });
  } catch (error) {
    console.error("Error al subir archivos:", error);
    res.status(500).json({ error: "Error al subir archivos a Cloudflare R2" });
  }
});

export default router;
