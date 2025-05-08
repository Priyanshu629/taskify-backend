import { Router } from "express";
import { addTask, assignTask, deleteTask, getTask, getTasks, unAssignTask, updateTask } from "../controllers/task.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/addTask").post(isAuthenticated, addTask);
router.route("/getTasks").get(isAuthenticated, getTasks);
router.route("/getTask/:id").get(isAuthenticated, getTask);
router.route("/deleteTask/:id").delete(isAuthenticated,deleteTask)
router.route("/updateTask/:id").put(isAuthenticated,updateTask)
router.route("/assignTask").patch(isAuthenticated,assignTask)
router.route("/unAssignTask/:id").patch(isAuthenticated,unAssignTask)

export default router;
