import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Render에서 이미 PORT 환경 변수 존재하므로 중복 선언 제거
const PORT = process.env.PORT || 10000;

app.use(express.static("public"));
app.use(express.json());

// 헬퍼 로그
console.log("🔑 HF_API_KEY:", process.env.HF_API_KEY ? "Loaded" : "Missing");

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
      "https://api-inference.huggingface.co/models/Klue/smoilLM3-3B",
      { inputs: userMessage },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000, // 60초 타임아웃
      }
    );

    // Hugging Face 모델 응답 안전하게 확인
    const reply =
      response.data?.[0]?.generated_text ||
      response.data?.generated_text ||
      "AI 응답을 불러오지 못했습니다.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ 서버 오류:", error.message);
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
