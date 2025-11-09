import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import Button from "../ui/Button.jsx";

export default function ConsejosBuscador({ accessToken }) {
    const [query, setQuery] = useState("");
    const [resultado, setResultado] = useState("");
    const { getConsejo, loading } = useApi(accessToken);

    const handleBuscar = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            const res = await getConsejo(query);
            setResultado(res.respuesta);
        } catch (error) {
            console.error("Error al buscar consejo:", error);
            setResultado("Hubo un error al buscar en nuestra base de conocimiento.");
        }
    };

    return (
        <div className="bg-white/80 rounded-2xl p-6 shadow-md backdrop-blur-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Explorar Consejos 💡
            </h2>
            <p className="text-sm text-gray-600 mb-4">
                ¿Sobre qué te gustaría aprender? Prueba buscar: "manejar el estrés",
                "técnica de respiración", "hobbies" o "ayuda profesional".
            </p>

            <form onSubmit={handleBuscar}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Escribe tu consulta aquí..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90"
                />
                <div className="mt-4">
                    <Button
                        type="submit"
                        label={loading ? "Buscando..." : "Buscar Consejo"}
                        disabled={loading || !query.trim()}
                    />
                </div>
            </form>

            {resultado && (
                <div className="mt-6 p-4 border border-blue-100 bg-blue-50 rounded-xl text-gray-700">
                    <p className="font-semibold mb-2">Respuesta de Auri:</p>
                    {/* Usamos 'whitespace-pre-line' para respetar saltos de línea */}
                    <p className="text-sm whitespace-pre-line">{resultado}</p>
                </div>
            )}
        </div>
    );
}