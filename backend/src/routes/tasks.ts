import { Router } from "express";
import taskController from "../controllers/task_controller.js";

const router = Router();

router.get("/", taskController.list);
router.post("/", taskController.create);

router.put("/reorder", taskController.reorder);

router.put("/:id", taskController.edit);
router.delete("/:id", taskController.delete);

export default router;

