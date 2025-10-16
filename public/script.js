const chatContainer = document.getElementById("chat");
const messageInput = document.getElementById("message");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");

// 메시지 보내기
async function sendMessage() {
  const message = messageInput.value.trim();
  const prompt = promptInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  messageInput.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, prompt }),
    });

    const data = await res.json();
    const reply = data.reply || "AI 응답을 불러오지 못했습니다.";
    appendMessage(reply, "bot");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (err) {
    appendMessage("서버 오류 발생", "bot");
    console.error(err);
  }
}

// 메시지 DOM 추가
function appendMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender;
  msgDiv.textContent = text;
  chatContainer.appendChild(msgDiv);
}

// 버튼 클릭
sendBtn.addEventListener("click", sendMessage);

// 엔터 키
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// 화면 반응형 (모바일 대응)
window.addEventListener("resize", () => {
  chatContainer.style.height = `calc(100vh - ${document.getElementById("inputArea").offsetHeight}px)`;
});

// 초기 높이 설정
chatContainer.style.height = `calc(100vh - ${document.getElementById("inputArea").offsetHeight}px)`;
