import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(".")); // index.html 루트에 있을 때

const HF_KEY = process.env.HF_API_KEY; // Render 대시보드에서 입력
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

app.post("/chat", async (req,res)=>{
  const userMessage = req.body.message || "";
  try{
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`,{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${HF_KEY}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({inputs:userMessage})
    });
    const result = await response.json();
    const reply = result?.[0]?.generated_text || "응답을 가져오지 못했어 😢";
    res.json({reply});
  }catch(err){
    console.error(err);
    res.json({reply:"오류가 발생했어 ❌"});
  }
});

// 루트 경로에서 index.html 제공
app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"));
});

const PORT = process.env.PORT || 5000; // Render가 할당한 포트 사용
app.listen(PORT,()=>console.log(`✅ 서버 실행 중: ${PORT}`));const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ 서버가 ${PORT}번 포트에서 실행 중!`));
