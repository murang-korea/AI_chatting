import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static(".")); // index.html이 루트에 있을 때

// 🔑 Hugging Face API 키
const HF_KEY = process.env.HF_API_KEY;

// 🔧 모델 지정 (원하는 모델로 바꿔도 됨)
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message || "";

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      headers: {
        "Authorization": `Bearer ${HF_KEY}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ inputs: userMessage })
    });

    const result = await response.json();
    const reply = result?.[0]?.generated_text || "응답을 가져오지 못했어 😢";
    res.json({ reply });
  } catch (err) {
    res.json({ reply: "오류가 발생했어 ❌" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ 서버가 ${PORT}번 포트에서 실행 중!`));
