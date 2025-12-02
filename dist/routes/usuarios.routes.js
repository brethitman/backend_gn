"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarios_controller_1 = require("../controllers/usuarios.controller");
const router = (0, express_1.Router)();
router.get("/", usuarios_controller_1.obtenerUsuarios);
router.put("/:id", usuarios_controller_1.actualizarUsuarioController);
exports.default = router;
//# sourceMappingURL=usuarios.routes.js.map