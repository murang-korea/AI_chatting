import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const HF_API_KEY = process.env.HF_API_KEY;
console.log("🔑 HF_API_KEY:", HF_API_KEY ? "Loaded" : "Missing");

app.post("/chat", async (req, res) => {
  const message = req.body.message;
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        inputs: `User: ${message}\nAssistant:`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
        }
      }),
    });

    const result = await response.json();
    console.log("🧠 HF Response:", result);

    if (result.error) {
      res.status(500).json({ reply: "⚠️ 모델 오류: " + result.error });
    } else {
      const output = result[0]?.generated_text?.split("Assistant:")[1]?.trim() || "🤖 응답이 비었어.";
      res.json({ reply: output });
    }

  } catch (error) {
    console.error("❌ 서버 에러:", error);
    res.status(500).json({ reply: "❌ 서버 내부 오류 발생" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ 서버가 ${PORT}번 포트에서 실행 중`));
