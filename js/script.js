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

        // Obtener el resp_id actual
        const respIdElement = document.querySelector('.resp_id');
        const currentRespId = respIdElement?.textContent?.trim() ?? "";

        //Llamada al backend
        fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessage, resp_id: currentRespId })
        })
        .then(response => response.json())
        .then(data => {
            const botResponse = formatBoldText(data.response);
            const newRespId = data.response_id;
            // Reemplaza el mensaje de "cargando"
            loadingMessage.innerHTML = botResponse;
            // Si viene un nuevo response_id, actualizar el resp_id en el DOM
            if (newRespId && respIdElement) {
                respIdElement.textContent = newRespId;
        }
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

    // Borrar memoria
    clearBtn.addEventListener("click", () => {
        
        // Elimina todos los mensajes, pero no el div resp_id
        const messages = chatWindow.querySelectorAll('.chat_message');
        messages.forEach(message => {
            message.remove(); // Elimina cada mensaje, pero no el div resp_id
        });
        
        // Si respIdElement existe, vacíalo pero mantenlo en el DOM
        const respIdElement = document.querySelector('.resp_id');
        if (respIdElement) {
            respIdElement.textContent = ""; // Vacía el contenido de resp_id
        }
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
    //Función para parsear texto en negrita 
    const formatBoldText = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };
    
});
