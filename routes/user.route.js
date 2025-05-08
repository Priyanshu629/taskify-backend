import { Router } from "express";
import { getUsers, loginUser, logout, registerUser } from "../controllers/user.controller.js";
import {isAuthenticated} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route('/logout').post(logout)
router.route("/getUsers").get(isAuthenticated,getUsers)

export default router;
