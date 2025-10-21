import express from "express";
import cors from "cors";
import generateRoute from "./routes/generate.js";
import analyzeRoute from "./routes/analyze.js";
import upscaleRoute from "./routes/upscale.js";
import bgRemoveRoute from "./routes/bgRemove.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

app.use("/generate", generateRoute);
app.use("/analyze", analyzeRoute);
app.use("/upscale", upscaleRoute);
app.use("/bgRemove", bgRemoveRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
