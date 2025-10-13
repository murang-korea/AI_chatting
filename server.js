import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "메시지가 비어 있습니다." });
    }

    const HF_API_KEY = process.env.HF_API_KEY;
    if (!HF_API_KEY) {
      return res.status(500).json({ error: "Hugging Face API 키가 없습니다." });
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/reedmayhew/claude-3.7-sonnet-reasoning-gemma3-12B",
      { inputs: userMessage },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data?.[0]?.generated_text || "AI 응답을 불러오지 못했습니다.";
    res.json({ reply });
  } catch (error) {
    console.error("❌ 서버 오류:", error.message);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(PORT, () => {
  console.log(`✅ 서버가 ${PORT} 포트에서 실행 중`);
});
