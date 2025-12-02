"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }); // guardamos en memoria
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ error: "Archivo requerido" });
        cloudinary_1.default.uploader.upload_stream({
            folder: "tiptap_uploads",
            transformation: [
                { width: 600, height: 400, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" },
            ],
        }, (error, result) => {
            if (error)
                return res.status(500).json({ error });
            res.json({ url: result?.secure_url });
        }).end(req.file.buffer);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al subir imagen" });
    }
});
exports.default = router;
//# sourceMappingURL=cloudinary.routes.js.map