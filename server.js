import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Hugging Face API 키 불러오기
const HF_API_KEY = process.env.HF_API_KEY;
console.log("🔑 HF_API_KEY:", HF_API_KEY ? "Loaded" : "Missing");

app.use(express.json());
app.use(express.static("public"));

// ✅ 테스트용 루트 페이지
app.get("/", (req, res) => {
  res.send("서버 작동 중 ✅");
});

// ✅ 채팅 요청 처리
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: "메시지가 비었음" });

    console.log("📨 사용자:", userMessage);

    // Hugging Face 모델 호출
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/reedmayhew/claude-3.7-sonnet-reasoning-gemma3-12B",
      {
        inputs: userMessage,
        parameters: { max_new_tokens: 200, temperature: 0.7 },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ HF 응답:", response.data);

    // Hugging Face 응답 형식에 맞춰 텍스트 추출
    let reply = "응답 없음";
    if (Array.isArray(response.data)) {
      reply = response.data[0]?.generated_text || "응답 없음";
    } else if (response.data.generated_text) {
      reply = response.data.generated_text;
    }

    res.json({ reply });
  } catch (error) {
    console.error("❌ 오류 발생:", error.response?.data || error.message);
    res.status(500).json({
      error: "서버 내부 오류 발생",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
