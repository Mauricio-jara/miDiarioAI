import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import { useApi } from "../../hooks/useApi.js";
import { endpoints } from "../../config/apiConfig.js";

export default function ChatBox({ accessToken }) {
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState("");

    const { enviarMensaje, loading: apiLoading } = useApi(accessToken);

    // Previene envíos simultáneos
    const isSendingRef = useRef(false);

    const messagesEndRef = useRef(null);

    // Cargar historial
    useEffect(() => {
        const cargarHistorial = async () => {
            try {
                const res = await fetch(endpoints.historial, {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });

                if (!res.ok) throw new Error("No se pudo cargar el historial.");

                const data = await res.json();
                setMensajes(data.reverse());
            } catch (error) {
                console.error("Error cargando historial:", error);
                setMensajes([
                    { rol: "assistant", texto: "¡Hola! ¿En qué puedo ayudarte hoy? 💜" }
                ]);
            }
        };
        if (accessToken) cargarHistorial();
    }, [accessToken]);

    // Scroll automático
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);

    // Envío del mensaje
    const handleEnviar = async () => {
        const textoParaEnviar = texto.trim();
        if (!textoParaEnviar) return;
        if (apiLoading || isSendingRef.current) return;

        // Bloqueo sincronizado
        isSendingRef.current = true;

        // Limpiar input visualmente
        setTexto("");

        try {
            console.log("→ ENVIANDO AL BACKEND:", textoParaEnviar);

            // Mandamos al backend y esperamos confirmación  
            const res = await enviarMensaje(textoParaEnviar);

            console.log("← RESPUESTA BACKEND:", res);

            // Solo ahora agregamos los mensajes a la UI
            setMensajes((prev) => [
                ...prev,
                { rol: "user", texto: textoParaEnviar },
                { rol: "assistant", texto: res.respuesta || "No se pudo obtener respuesta." }
            ]);

        } catch (error) {
            console.error("Error enviando mensaje:", error);
            setMensajes((prev) => [
                ...prev,
                { rol: "assistant", texto: "¡Uy! Parece que tuve un problema. Inténtalo de nuevo." }
            ]);
        } finally {
            isSendingRef.current = false;
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleEnviar();
        }
    };

    return (
        <div className="flex flex-col justify-between w-full h-[600px] bg-white/80 p-6 rounded-2xl shadow-md backdrop-blur-md">
            <div className="flex items-center mb-4 space-x-2">
                <img src="/logo.png" alt="MiDiarioIA" className="w-8 h-8" />
                <h1 className="text-gray-700 font-semibold text-lg">
                    Hoy es buen día para reflexionar 🌤️
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-2 mb-2 scrollbar-thin">
                {mensajes.map((msg, idx) => (
                    <MessageBubble key={idx} rol={msg.rol} texto={msg.texto} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-3 mt-2">
                <input
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90"
                    disabled={apiLoading}
                />

                {/* Botón ya no usa type="submit" para evitar envíos duplicados */}
                <button
                    type="button"
                    onClick={handleEnviar}
                    disabled={apiLoading}
                    className="px-5 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition disabled:bg-blue-300"
                >
                    {apiLoading ? "..." : "Enviar"}
                </button>
            </div>
        </div>
    );
}
