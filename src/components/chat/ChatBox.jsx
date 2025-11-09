import { useState, useEffect, useRef } from "react"; // Añadir useEffect y useRef
import MessageBubble from "./MessageBubble.jsx";
import { useApi } from "../../hooks/useApi.js";
import { endpoints } from "../../config/apiConfig.js"; // Importar endpoints

// Aceptar 'accessToken' como prop
export default function ChatBox({ accessToken }) {
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState("");

    // Pasar el token al hook
    const { enviarMensaje, loading } = useApi(accessToken);

    // Ref para el scroll automático
    const messagesEndRef = useRef(null);

    // Cargar historial de chat al iniciar el componente
    useEffect(() => {
        const cargarHistorial = async () => {
            try {
                const res = await fetch(endpoints.historial, {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });

                if (!res.ok) {
                    throw new Error("No se pudo cargar el historial.");
                }

                const data = await res.json();
                // El historial viene de la DB (desc), pero lo queremos asc para mostrarlo
                setMensajes(data.reverse());

            } catch (error) {
                console.error("Error cargando historial:", error);
                // Mensaje inicial si falla la carga
                setMensajes([{ rol: "assistant", texto: "¡Hola! ¿En qué puedo ayudarte hoy? 💜" }]);
            }
        };

        if (accessToken) {
            cargarHistorial();
        }
    }, [accessToken]); // Se ejecuta solo cuando el token está disponible

    // Auto-scroll al final cuando llegan mensajes nuevos
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);

    const handleEnviar = async () => {
        if (!texto.trim() || loading) return;

        const nuevo = { rol: "user", texto };
        setMensajes((prev) => [...prev, nuevo]);
        setTexto("");

        try {
            // Ya no se pasa 'usuario_id'
            const res = await enviarMensaje(texto);

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
                {/* Elemento vacío para el auto-scroll */}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-3 mt-2">
                <input
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    // Añadimos 'Enter' para enviar
                    onKeyPress={(e) => e.key === 'Enter' && !loading && handleEnviar()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90"
                />
                <button
                    onClick={handleEnviar}
                    disabled={loading}
                    className="px-5 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition disabled:bg-blue-300"
                >
                    {loading ? "..." : "Enviar"}
                </button>
            </div>
        </div>
    );
}