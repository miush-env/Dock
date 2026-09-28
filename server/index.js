import express from "express";
import cors from "cors";
import fileRoutes from "./routes/fileRoutes.js";
import { initSocket } from "./config/socket.js";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server running with Cloudflare R2 storage");
});

app.use(fileRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} with Cloudflare R2`);
});

initSocket(server);
