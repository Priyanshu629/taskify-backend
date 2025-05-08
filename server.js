import { config } from "dotenv";
config();
import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";
import databaseConnection from "./config/db.js";

import { isAuthenticated } from "./middlewares/auth.middleware.js";


const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);



databaseConnection()
  .then(() => {
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.get("/api/v1/check", isAuthenticated, (req, res) => {
      return res
        .status(200)
        .json({ userId: req.user.id, userEmail: req.user.email });
    });

    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/task", taskRouter);

    
    

    app.listen(PORT, () =>
      console.log(`Server listening on http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit process if database connection fails
  });
