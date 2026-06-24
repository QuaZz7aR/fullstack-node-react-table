import express from "express";
import cors from "cors";
import db from "./database.js";
import employeesRouter from "./routes/employees.js"

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/employees", employeesRouter)

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
})

app.listen(PORT, () => {
    console.log(`Server running in port: ${PORT}`)
})