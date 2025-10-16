import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ public 폴더 정적 파일 서빙
app.use(express.static("public"));
app.use(express.json());

// ✅ Hugging Face API 엔드포인트
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/klue/bert-base";
const HF_API_KEY = process.env.HF_API_KEY;

if (!HF_API_KEY) {
  console.error("🚨 환경 변수 HF_API_KEY가 설정되지 않았습니다!");
}

// ✅ 채팅 요청 처리
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message?.trim();

    if (!userMessage) {
      return res.status(400).json({ error: "❌ 메시지가 비어 있습니다." });
    }

    console.log(`📩 사용자 입력: ${userMessage}`);

    const response = await axios.post(
      HF_MODEL_URL,
      { inputs: userMessage },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Hugging Face 응답:", response.data);

    // 모델 형식에 따라 다름
    const reply =
      response.data?.[0]?.generated_text ||
      response.data?.generated_text ||
      JSON.stringify(response.data);

    res.json({ reply });
  } catch (error) {
    console.error("❌ 서버 오류 상세:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({
      error:
        error.response?.data?.error ||
        error.response?.data ||
        error.message ||
        "서버 내부 오류",
    });
  }
});

// ✅ 기본 라우트 (index.html 서빙)
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
  console.log(`🔑 HF_API_KEY: ${HF_API_KEY ? "✅ 로드됨" : "❌ 없음"}`);
});
