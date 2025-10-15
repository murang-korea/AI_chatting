// server.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const HF_API_KEY = process.env.HF_API_KEY;

// ✅ Hugging Face API 키 체크
if (!HF_API_KEY) {
  console.error("❌ Hugging Face API 키가 없습니다. .env 또는 Render 환경 변수 확인");
  process.exit(1);
}

// 정적 파일 서비스
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());

// 챗 요청 처리
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: "메시지가 비어 있습니다." });

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/KLUE/klue-bert-base", // 원하는 모델 URL로 변경
      { inputs: userMessage },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 모델 응답 가져오기
    const reply = response.data?.[0]?.generated_text || "AI 응답을 불러오지 못했습니다.";
    res.json({ reply });
  } catch (error) {
    console.error("❌ 서버 오류:", error.message);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

// index.html 반환
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버가 ${PORT} 포트에서 실행 중`);
});
