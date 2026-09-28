import { Router } from "express";
import multer from "multer";
import {
  fetchAllFiles,
  fetchFilesRoom,
  uploadFiles,
  deleteFileFromRoom,
  renameFileInRoom,
} from "../services/fileService.js";

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

    const uploaded = await uploadFiles(
      req.files,
      req.body.fileName,
      req.body.ownerFiles,
      req.body.roomId
    );
    res.json({ message: "Files uploaded", files: uploaded });
  } catch (error) {
    console.error("Error al subir archivos:", error);
    res.status(500).json({ error: "Error al subir archivos a Cloudflare R2" });
  }
});

// Eliminar un archivo de la sala en R2
router.delete("/:roomId/:fileName", async (req, res) => {
  try {
    const { roomId, fileName } = req.params;
    const result = await deleteFileFromRoom(roomId, fileName);
    res.json({ message: "Archivo eliminado correctamente", ...result });
  } catch (error) {
    console.error("Error al eliminar archivo:", error);
    res.status(500).json({ error: "Error al eliminar el archivo en Cloudflare R2" });
  }
});

// Renombrar un archivo en R2
router.put("/:roomId/rename", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { oldFileName, newFileName } = req.body;

    if (!oldFileName || !newFileName) {
      return res.status(400).json({ error: "Faltan los nombres de archivo" });
    }

    const result = await renameFileInRoom(roomId, oldFileName, newFileName);
    res.json({ message: "Archivo renombrado correctamente", ...result });
  } catch (error) {
    console.error("Error al renombrar archivo:", error);
    res.status(500).json({ error: "Error al renombrar el archivo en Cloudflare R2" });
  }
});

export default router;
