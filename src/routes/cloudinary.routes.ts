import { Router } from "express";
import multer from "multer";

import cloudinary from "../config/cloudinary";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // guardamos en memoria

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });

    cloudinary.uploader.upload_stream(
      {
        folder: "tiptap_uploads",
        transformation: [
          { width: 600, height: 400, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) return res.status(500).json({ error });
        res.json({ url: result?.secure_url });
      }
    ).end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al subir imagen" });
  }
});

export default router;
