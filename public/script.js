const chatDiv = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

function addMessage(content, className) {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = content;
  msgDiv.className = className;
  chatDiv.appendChild(msgDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function sendMessage() {
  const msg = messageInput.value.trim();
  if (!msg) return;
  addMessage(msg, "user");
  messageInput.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    addMessage(data.reply || "응답 없음", "bot");
  } catch {
    addMessage("서버 오류 발생", "bot");
  }
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
