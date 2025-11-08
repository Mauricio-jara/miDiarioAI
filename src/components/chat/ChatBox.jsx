import { useState } from "react";
import MessageBubble from "./MessageBubble.jsx";
import { useApi } from "../../hooks/useApi.js";

export default function ChatBox() {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const { enviarMensaje, loading } = useApi();
  const usuario_id = "c1b8e6d0-0000-0000-0000-000000000001"; // Cambia por ID real

  const handleEnviar = async () => {
    if (!texto.trim()) return;

    const nuevo = { rol: "user", texto };
    setMensajes((prev) => [...prev, nuevo]);
    setTexto("");

    const res = await enviarMensaje(usuario_id, texto);

    const respuestaIA = {
      rol: "assistant",
      texto: res.respuesta_auri || "No se pudo obtener respuesta.",
    };
    setMensajes((prev) => [...prev, respuestaIA]);
  };

  return (
    <div className="flex flex-col justify-between w-full h-[600px] bg-white/80 p-6 rounded-2xl shadow-md backdrop-blur-md">
      <div className="flex items-center mb-4 space-x-2">
        <img src="/logo.png" alt="MiDiarioIA" className="w-8 h-8" />
        <h1 className="text-gray-700 font-semibold text-lg">
          ¡Hola, César! Hoy es buen día para reflexionar 🌤️
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 p-2 mb-2 scrollbar-thin">
        {mensajes.map((msg, idx) => (
          <MessageBubble key={idx} rol={msg.rol} texto={msg.texto} />
        ))}
      </div>

      <div className="flex items-center gap-3 mt-2">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90"
        />
        <button
          onClick={handleEnviar}
          disabled={loading}
          className="px-5 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
