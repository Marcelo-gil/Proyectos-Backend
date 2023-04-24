const socket = io();

const form = document.getElementById("form");

const container = document.getElementById("container");

socket.on("showProducts", (data) => {
    container.innerHTML = ``;

    data.forEach((prod) => {
        container.innerHTML += `
            <tr>
                <td>${prod.id}</td>
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
