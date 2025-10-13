document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const messages = document.getElementById("chat-messages");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    const userDiv = document.createElement("div");
    userDiv.textContent = "👤 " + message;
    messages.appendChild(userDiv);

    input.value = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const botDiv = document.createElement("div");
      botDiv.textContent = "🤖 " + (data.reply || data.error);
      messages.appendChild(botDiv);
    } catch (err) {
      const errDiv = document.createElement("div");
      errDiv.textContent = "❌ 서버 오류: " + err.message;
      messages.appendChild(errDiv);
    }
  });
});
