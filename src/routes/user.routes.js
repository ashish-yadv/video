import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

// Creating a router
const router = Router();

// router.route("/register").post(registerUser); // Without using middleware

// Using "multer" middleware to handle file upload. We have used the "upload" middleware that we have created.
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1 // No. of files I will accept
        },
        {
            name: "coverImage",
            maxCount: 1
        },
    ]),
    registerUser
);


export default router;