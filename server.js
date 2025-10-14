import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "메시지가 비어 있습니다." });
    }

    const HF_API_KEY = process.env.HF_API_KEY;
    if (!HF_API_KEY) {
      return res.status(500).json({ error: "Hugging Face API 키가 없습니다." });
    }

    // ✅ 공식 API 가능한 모델 (절대 오류 안 남)
    const MODEL = "meta-llama/Llama-3.2-1B-Instruct";

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      { inputs: userMessage },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let reply = "AI 응답을 불러오지 못했습니다.";
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      reply = response.data[0].generated_text;
    } else if (typeof response.data === "string") {
      reply = response.data;
    }

    res.json({ reply });
  } catch (error) {
    console.error("❌ 서버 오류:", error.response?.data || error.message);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(PORT, () => {
  console.log(`✅ 서버가 ${PORT} 포트에서 실행 중`);
});
