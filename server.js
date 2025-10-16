import express from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

app.use(express.json());
app.use(express.static("public")); // index.html, css, js

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: "메시지가 없습니다." });

    const chatCompletion = await client.chat.completions.create({
      model: "katanemo/Arch-Router-1.5B:hf-inference",
      messages: [
        { role: "user", content: userMessage }
      ],
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("서버 오류:", err);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

app.listen(PORT, () => console.log(`✅ 서버가 ${PORT}번 포트에서 실행 중`));
