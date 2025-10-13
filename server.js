import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY;

// ✅ 이 위치에 콘솔 로그
console.log("🔑 HF_API_KEY:", HF_API_KEY ? "Loaded" : "Missing");

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: req.body.message }),
    });

    const data = await response.json();
    console.log("🧠 HF Response:", data);

    if (data.error) {
      return res.status(500).json({ reply: "모델 오류: " + data.error });
    }

    const reply =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : data.generated_text || "응답 없음";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "서버 오류 발생" });
  }
});

app.listen(10000, () => console.log("✅ 서버가 10000번 포트에서 실행 중"));
