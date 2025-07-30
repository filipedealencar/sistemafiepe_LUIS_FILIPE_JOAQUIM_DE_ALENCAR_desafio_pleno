import { Router } from "express";
import formulariosRoutes from "./formularios.routes";
import respostasRoutes from "./respostas.routes";

const router = Router();

router.use("/formularios", formulariosRoutes);
router.use("/formularios", respostasRoutes);

export default router;
