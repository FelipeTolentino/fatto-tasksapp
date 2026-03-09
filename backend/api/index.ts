import express from "express";
import cors from "cors";
import serverless from "serverless-http";

import taskRoutes from "../src/routes/tasks.js";

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.use("/tarefas", taskRoutes);

app.get("/", (req, res) => {
  res.send("API working");
});

export default serverless(app);