// ruta: mauricio-jara/midiarioai/miDiarioAI-lucas/src/hooks/useApi.js
import { useState, useCallback } from "react"; // <--- Importar useCallback
import { endpoints } from "../config/apiConfig";

// El Hook ahora acepta el token
export function useApi(accessToken) {
    const [loading, setLoading] = useState(false);

    // Función genérica para construir los headers de autenticación
    // La envolvemos en useCallback para estabilizarla
    const getAuthHeaders = useCallback(() => {
        if (!accessToken) {
            console.error("useApi: No se proporcionó accessToken.");
        }
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        };
    }, [accessToken]); // Depende solo del token

    // Envolvemos enviarMensaje en useCallback
    const enviarMensaje = useCallback(async (texto) => {
        setLoading(true);
        const res = await fetch(endpoints.chat, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ texto }),
        });
        setLoading(false);
        return await res.json();
    }, [getAuthHeaders]); // Depende de getAuthHeaders

    // Envolvemos guardarEntrada en useCallback
    const guardarEntrada = useCallback(async (contenido, titulo = null) => {
        setLoading(true);
        const res = await fetch(endpoints.diario, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ contenido, titulo }),
        });
        setLoading(false);
        return await res.json();
    }, [getAuthHeaders]); // Depende de getAuthHeaders

    // Envolvemos getResumen en useCallback
    const getResumen = useCallback(async () => {
        setLoading(true);
        const res = await fetch(endpoints.resumen, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        setLoading(false);
        return await res.json();
    }, [getAuthHeaders]); // Depende de getAuthHeaders

    // Devolvemos las funciones memorizadas
    return { enviarMensaje, guardarEntrada, getResumen, loading };
}