import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Configure "cors", "cookie-parser". "cors", "cookie-parser" can be configured only when we have created out app. So, create the app first.
// "app.use" is used to configure "middlewares".
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());


// routes import
import userRouter from "./routes/user.routes.js";


// routes declaration
// app.use("/users", userRouter)
app.use("/api/v1/users", userRouter);




export { app };