const socket = io(); // librería Socket.IO para la comunicación en tiempo real

// Verifica si el usuario está registrado a través de una cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift(); // Devuelve el valor de la cookie
}

// Redirige al usuario a register.html si no está registrado
const username = getCookie("username");
if (!username) {
  window.location.href = "register.html";
}

const send = document.querySelector("#send-message"); // Botón para enviar mensajes
const allMessages = document.querySelector("#all-messages"); // Contenedor de mensajes

// Muestra el nombre de usuario en la interfaz
send.addEventListener("click", () => {
  const message = document.querySelector("#message").value;
  // Verifica si el mensaje no está vacío
  if (message.trim()) {
    socket.emit("message", { user: username, message });
    document.querySelector("#message").value = "";
  }
});

// Escucha los mensajes enviados por otros usuarios
socket.on("message", ({ user, message }) => {
  // Crea un nuevo mensaje en el contenedor de mensajes y muestra el mensaje en la interfaz
  const msg = document.createRange().createContextualFragment(`
    <div class="message d-flex align-items-start">
      <img src="/img/Foto.jpg" class="rounded-circle me-2" style="width: 40px; height: 40px; object-fit: cover;">
      <div>
        <div class="user-info d-flex align-items-center mb-1">
          <span class="fw-bold me-2">${user}</span>
          <span class="text-muted small">Hace 1 minuto</span>
        </div>
        <p class="mb-0">${message}</p>
      </div>
    </div>
  `);
  allMessages.append(msg);
});

// Referencia al contenedor de usuarios conectados
const usersList = document.querySelector("#users-list");

// Notifica al servidor que un usuario se ha conectado
socket.emit("user_connected", username);

// Escucha la lista actualizada de usuarios conectados
socket.on("users", (users) => {
  usersList.innerHTML = ""; // Limpia la lista
  users.forEach((user) => {
    const userItem = document.createElement("div"); // Crea un nuevo elemento para cada usuario
    // Asigna clases y contenido al elemento
    userItem.className = "user-item d-flex align-items-center mb-2";
    userItem.innerHTML = `
      <span class="me-2" style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#28a745;border:1.5px solid #fff;"></span>
      <img src="/img/Foto.jpg" class="rounded-circle me-2" style="width: 32px; height: 32px; object-fit: cover;">
      <span class="fw-bold">${user}</span>
    `;
    usersList.appendChild(userItem);
  });
});

