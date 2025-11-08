import { useState } from "react";
import { endpoints } from "../config/apiConfig";

export function useApi() {
  const [loading, setLoading] = useState(false);

  const enviarMensaje = async (usuario_id, texto) => {
    setLoading(true);
    const res = await fetch(endpoints.chat, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id, texto }),
    });
    setLoading(false);
    return await res.json();
  };

  const guardarEntrada = async (usuario_id, contenido) => {
    setLoading(true);
    const res = await fetch(endpoints.diario, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id, contenido }),
    });
    setLoading(false);
    return await res.json();
  };

  return { enviarMensaje, guardarEntrada, loading };
}
