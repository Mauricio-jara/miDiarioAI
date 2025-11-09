// ruta: mauricio-jara/midiarioai/miDiarioAI-lucas/src/components/chat/ChatBox.jsx

import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import { useApi } from "../../hooks/useApi.js";
import { endpoints } from "../../config/apiConfig.js";

export default function ChatBox({ accessToken }) {
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState("");

    // El loading del hook es bueno para la UI
    const { enviarMensaje, loading: apiLoading } = useApi(accessToken);

    // (NUEVO) Usamos un Ref para un bloqueo SÍNCRONO e inmediato
    const isSendingRef = useRef(false);

    // Mantenemos un estado de UI para deshabilitar el botón (asíncrono)
    const [isSendingUI, setIsSendingUI] = useState(false);

    const messagesEndRef = useRef(null);

    // Cargar historial de chat (sin cambios)
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
                setMensajes([{ rol: "assistant", texto: "¡Hola! ¿En qué puedo ayudarte hoy? 💜" }]);
            }
        };
        if (accessToken) cargarHistorial();
    }, [accessToken]);

    // Auto-scroll (sin cambios)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);


    // Lógica de envío (con bloqueo síncrono)
    const handleEnviar = async (e) => {
        if (e) e.preventDefault();

        // (NUEVO) Revisar el Ref síncrono
        if (isSendingRef.current) return;

        const textoParaEnviar = texto.trim();
        if (!textoParaEnviar || apiLoading) return;

        // (NUEVO) Bloquear síncronamente
        isSendingRef.current = true;

        // Actualizar la UI
        setIsSendingUI(true);
        setTexto("");
        const nuevo = { rol: "user", texto: textoParaEnviar };
        setMensajes((prev) => [...prev, nuevo]);

        try {
            const res = await enviarMensaje(textoParaEnviar);
            const respuestaIA = {
                rol: "assistant",
                texto: res.respuesta || "No se pudo obtener respuesta.",
            };
            setMensajes((prev) => [...prev, respuestaIA]);

        } catch (error) {
            const errorIA = {
                rol: "assistant",
                texto: "¡Uy! Parece que tuve un problema. Inténtalo de nuevo."
            };
            setMensajes((prev) => [...prev, errorIA]);
        } finally {
            // (NUEVO) Desbloquear síncronamente
            isSendingRef.current = false;
            setIsSendingUI(false);
        }
    };

    // El estado de carga ahora combina el hook y el estado de la UI
    const isLoading = apiLoading || isSendingUI;

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

            <form onSubmit={handleEnviar} className="flex items-center gap-3 mt-2">
                <input
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition disabled:bg-blue-300"
                >
                    {isLoading ? "..." : "Enviar"}
                </button>
            </form>
        </div>
    );
}