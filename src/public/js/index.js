const socket = io();

const form = document.getElementById("form");

const container = document.getElementById("container");

socket.on("showProducts", (data) => {
    container.innerHTML = ``;
    data.forEach((prod) => {
        container.innerHTML += `
            <tr>
                <td>${prod._id}</td>
                <td>${prod.title}</td> 
                <td>${prod.description}</td>
                <td>${prod.price}</td>
                <td>${prod.code}</td>
                <td>${prod.stock}</td>
                <td>${prod.status}</td>
                <td>${prod.category}</td>
            </tr>
        `;
    });
});

// chat
let user;
const chatbox = document.getElementById("chatBox");

Swal.fire({
    title: "Identificate",
    input: "email",
    text: "Ingresa tu dirección de email para ingresar al chat",
    inputValidator: (value) => {
        return (
            !value.includes("@") &&
            "Necesitas escribir un correo eléctronico para comenzar a chatear"
        );
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then((result) => {
    user = result.value;
    socket.emit("authenticated", user);
});

chatbox.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") {
        if (chatbox.value.trim().length > 0) {
            socket.emit("message", { user, message: chatbox.value });
            chatbox.value = "";
        }
    }
});

socket.on("messageLogs", (data) => {
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.forEach((message) => {
        messages += `${message.user} dice: ${message.message}<br/>`;
    });
    log.innerHTML = messages;
});

socket.on("newUserConnected", (data) => {
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: "success",
    });
});
