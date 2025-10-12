import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
    });

    const data = await response.json();
    let reply = "응답을 불러올 수 없어요 😢";
    if (Array.isArray(data) && data[0]?.generated_text) reply = data[0].generated_text;
    else if (data.generated_text) reply = data.generated_text;

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.json({ reply: "⚠️ 서버 오류가 발생했어요." });
  }
});

app.listen(port, () => console.log(`✅ 서버 실행 중: http://localhost:${port}`));
