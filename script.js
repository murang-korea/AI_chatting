const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");

async function sendMessage() {
  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  messageInput.value = "";

  addMessage("bot", "생각 중...");

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userMessage })
    });

    const data = await res.json();
    chat.lastChild.textContent = data.reply || "오류 발생";
  } catch (err) {
    chat.lastChild.textContent = "⚠️ 서버 오류";
  }
}

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = role;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
