import { Router } from "express";

import { obtenerUsuarios, actualizarUsuarioController } from "../controllers/usuarios.controller";

const router = Router();

router.get("/", obtenerUsuarios);
router.put("/:id", actualizarUsuarioController);

export default router;
