import express from "express";
import cors from "cors";
import db from "./database.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
})

app.get("/db-test", (req, res) => {
    const result = db.prepare("SELECT 1 + 4 AS result").get();
    res.json(result);
})

app.listen(PORT, () => {
    console.log(`Server running in port: ${PORT}`)
})