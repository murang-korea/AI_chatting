import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: userMessage,
        parameters: { max_new_tokens: 100, temperature: 0.7 },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API 오류:", data);
      return res.status(500).json({ error: "Hugging Face 응답 오류" });
    }

    const reply = data[0]?.generated_text || "응답이 없습니다.";
    res.json({ reply });
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ 서버 실행됨: 포트 ${PORT}`));
