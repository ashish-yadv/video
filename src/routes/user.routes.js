import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

// Creating a router
const router = Router();

router.route("/register").post(registerUser);

export default router;