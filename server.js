import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const HF_API_KEY = process.env.HF_API_KEY;
const MODEL_URL = "https://api-inference.huggingface.co/models/reedmayhew/claude-3.7-sonnet-reasoning-gemma3-12B";

app.post("/chat", async (req, res) => {
  try {
    const userMsg = req.body.message || "";

    const response = await axios.post(
      MODEL_URL,
      { inputs: userMsg },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    const reply =
      (response.data[0] && response.data[0].generated_text) ||
      "⚠️ 모델 응답이 비어 있습니다.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ 서버 오류:", err.message);
    res.status(500).json({ reply: "서버 내부 오류 발생" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ 서버가 ${PORT}번 포트에서 실행 중`));
