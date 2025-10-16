import express from "express";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const HF_TOKEN = process.env.HF_TOKEN;

app.use(express.static("public"));
app.use(express.json());

// 🧠 채팅 요청 처리
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const prompt = req.body.prompt || "";

    if (!userMessage) {
      return res.status(400).json({ error: "메시지가 비어 있습니다." });
    }

    if (!HF_TOKEN) {
      return res.status(500).json({ error: "Hugging Face API 키가 없습니다." });
    }

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: HF_TOKEN,
    });

    const chatCompletion = await client.chat.completions.create({
      model: "katanemo/Arch-Router-1.5B:hf-inference",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userMessage },
      ],
    });

    const reply = chatCompletion.choices[0].message.content || "AI 응답을 불러오지 못했습니다.";
    res.json({ reply });
  } catch (error) {
    console.error("❌ 서버 오류:", error.response?.data || error.message);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

// 기본 페이지 라우트
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(PORT, () => {
  console.log(`✅ 서버가 ${PORT} 포트에서 실행 중`);
});
