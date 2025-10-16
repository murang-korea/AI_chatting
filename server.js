import express from "express";
import axios from "axios";
import dotenv from "dotenv";

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
    const userPrompt = req.body.prompt || "";

    if (!userMessage) {
      return res.status(400).json({ error: "메시지가 비어 있습니다." });
    }

    if (!HF_TOKEN) {
      return res.status(500).json({ error: "Hugging Face API 키가 없습니다." });
    }

    const payload = {
      model: "zai-org/GLM-4.6:novita",
      messages: [
        { role: "system", content: userPrompt || "You are helpful AI named 오로라." },
        { role: "user", content: userMessage },
      ],
    };

    const response = await axios.post(
      "https://api-inference.huggingface.co/v1/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      response.data?.choices?.[0]?.text ||
      "AI 응답을 불러오지 못했습니다.";

    res.json({ reply });
  } catch (err) {
    console.error("❌ 서버 오류:", err.response?.data || err.message);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(PORT, () => {
  console.log(`✅ 서버가 ${PORT} 포트에서 실행 중`);
});
