import express from "express";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(express.json());

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

app.post("/chat", async (req, res) => {
  try {
    const { message, prompt } = req.body;
    if (!message) return res.status(400).json({ error: "메시지가 없습니다." });

    const completion = await client.chat.completions.create({
      model: "katanemo/Arch-Router-1.5B:hf-inference",
      messages: [
        { role: "system", content: prompt || "" },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ 서버 실행 중: ${PORT}`));
