document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById("chatWindow");
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const clearBtn = document.getElementById("clearBtn");

    // Función para enviar el mensaje (funciona tanto con click como con Enter)
    const sendMessage = () => {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") return;
    
        addMessageToChat("user", userMessage);
        chatInput.value = "";
    
        // Mostrar mensaje de "cargando"
        const typingHTML = `<div class="typing"><span>.</span><span>.</span><span>.</span></div>`;
        const loadingMessage = addMessageToChat("bot", typingHTML, true);

        //Llamada al backend
        fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            const botResponse = data.response;
            // Reemplaza el mensaje de "cargando"
            loadingMessage.textContent = botResponse;
        })
        .catch(error => {
            console.error("Error al comunicarse con el backend:", error);
            loadingMessage.textContent = "Hubo un error al contactar al servidor.";
        });
    };
    

    // Enviar al presionar el botón
    sendBtn.addEventListener("click", (e) => {
        e.preventDefault(); // evita que se recargue la página
        sendMessage(); // Llama a la función para enviar el mensaje
    });

    // Enviar al presionar Enter
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) { // Verifica si se presionó Enter sin Shift
            e.preventDefault(); // Evita el salto de línea
            sendMessage(); // Llama a la función para enviar el mensaje
        }
    });

    // Elimina todos los mensajes (este botón debe existir en tu HTML)
    clearBtn.addEventListener("click", () => {
        chatWindow.innerHTML = ""; // Elimina todos los mensajes
    });

    // Función para agregar el mensaje al chat
    function addMessageToChat(sender, message, isHTML = false) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat_message", sender);
        if (isHTML) {
            msgDiv.innerHTML = message;
        } else {
            msgDiv.textContent = message;
        }
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return msgDiv;
    }
    
});
