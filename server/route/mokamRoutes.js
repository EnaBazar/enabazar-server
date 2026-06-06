import express from "express";
import { mokamController } from "../controllers/mokamController.js";

const router = express.Router();
router.route("/").post(mokamController.create).get(mokamController.getAll);
router.route("/:id").get(mokamController.getOne).put(mokamController.update).delete(mokamController.remove);
export default router;
