import express from "express";
import cors from "cors";
import "dotenv/config";

import taskRoutes from "./routes/tasks.js";

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.use("/tarefas", taskRoutes);

app.get("/", (req, res) => {
	res.send("API working");
});

app.listen(3000, () => {
	console.log("Server running");
});
