const chatArea = document.getElementById("chat");
const messageInput = document.getElementById("message");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");

async function sendMessage() {
  const userMessage = messageInput.value.trim();
  const userPrompt = promptInput.value.trim();

  if (!userMessage) return;

  const userDiv = document.createElement("div");
  userDiv.className = "user";
  userDiv.textContent = userMessage;
  chatArea.appendChild(userDiv);
  chatArea.scrollTop = chatArea.scrollHeight;

  messageInput.value = "";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        prompt: userPrompt,
      }),
    });

    const data = await response.json();
    const botDiv = document.createElement("div");
    botDiv.className = "bot";
    botDiv.textContent = data.reply || "AI 응답을 불러오지 못했습니다.";
    chatArea.appendChild(botDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  } catch (err) {
    console.error("서버 오류:", err);
    const errorDiv = document.createElement("div");
    errorDiv.className = "bot";
    errorDiv.textContent = "서버 오류가 발생했습니다.";
    chatArea.appendChild(errorDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
