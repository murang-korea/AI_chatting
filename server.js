import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; // 이거 한 줄만 남기기!

app.use(express.static("public"));
app.use(express.json());

// 나머지 코드 쭉 그대로
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ 서버가 ${PORT} 포트에서 실행 중`);
});
