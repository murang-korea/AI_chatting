import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const HF_API_KEY = process.env.HF_API_KEY;

app.use(express.static("public"));
app.use(express.json());

// 💬 채팅 처리
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "메시지가 비어 있습니다." });
    }

    if (!HF_API_KEY) {
      return res.status(500).json({ error: "Hugging Face API 키가 없습니다." });
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
      {
        inputs: userMessage,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.8,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data?.[0]?.generated_text ||
      response.data?.generated_text ||
      "AI 응답을 불러오지 못했습니다.";

    console.log("✅ AI 응답:", reply);
    res.json({ reply });
  } catch (error) {
    console.error("❌ 서버 오류:", error.response?.data || error.message);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

// 기본 페이지
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(PORT, () => {
  console.log(`✅ 서버가 ${PORT} 포트에서 실행 중`);
});
