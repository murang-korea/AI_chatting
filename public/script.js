const chatDiv = document.getElementById("chat");
const messageInput = document.getElementById("message");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", async () => {
  const message = messageInput.value.trim();
  const prompt = promptInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  messageInput.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, prompt }),
    });
    const data = await res.json();
    appendMessage("bot", data.reply);
  } catch (err) {
    appendMessage("bot", "서버 오류 발생");
    console.error(err);
  }
});

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = sender;
  div.textContent = text;
  chatDiv.appendChild(div);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}
