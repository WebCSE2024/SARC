import cors from "cors";
import { errorHandler } from "./src/middlewares/errorhandler.js";
import referralRouter from "./src/routes/referral.routes.js";
import publicationRouter from "./src/routes/publications.routes.js";
import express from "express";
import seminarRouter from "./src/routes/seminar.routes.js";
import achievementRoutes from "./src/routes/achievement.routes.js";
import commentRouter from "./src/routes/comments.routes.js";
import likeRouter from "./src/routes/likes.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// API routes
app.use("/sarc/v0/referral", referralRouter);
app.use("/sarc/v0/publication", publicationRouter);
app.use("/sarc/v0/seminar", seminarRouter);
app.use("/sarc/v0/achievement", achievementRoutes);
app.use("/sarc/v0/likes", likeRouter);
app.use("/sarc/v0/comments", commentRouter);

app.get("/sarc/v0/api", (req, res) => {
  res.send("hello from server api");
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../client/dist");
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    // Skip API routes for catch-all handler
    if (!req.path.startsWith("/sarc/v0/")) {
      res.sendFile(path.join(distPath, "index.html"));
    }
  });
} else {
  app.get("/", (req, res) => {
    res.send("hello from server");
  });
}

app.use(errorHandler);
export { app };
