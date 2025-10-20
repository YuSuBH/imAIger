import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

app.use("/", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
