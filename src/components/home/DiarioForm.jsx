import { useState } from "react";
import Button from "../ui/Button.jsx";
import InputArea from "../ui/InputArea.jsx";
import { useApi } from "../../hooks/useApi";

// Aceptar 'accessToken' como prop
export default function DiarioForm({ accessToken }) {
    const [texto, setTexto] = useState("");
    const [resultado, setResultado] = useState(null);

    // Pasar token al hook
    const { guardarEntrada, loading } = useApi(accessToken);

    const handleGuardar = async () => {
        if (!texto.trim()) return;

        // Ya no se pasa 'usuario_id'
        const res = await guardarEntrada(texto);

        // Verificamos si la respuesta del backend fue exitosa
        if (res && res.emocion_predominante) {
            setResultado(res);
            setTexto("");
        } else {
            // Manejar un posible error del backend
            setResultado({
                emocion_predominante: "Error",
                resumen_ia: res.detail || "No se pudo analizar la entrada."
            });
        }
    };

    return (
        <div className="bg-white/80 rounded-2xl p-6 shadow-md backdrop-blur-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Escribe aquí tu entrada de hoy ✍️
            </h2>

            <InputArea
                value={texto}
                onChange={setTexto}
                placeholder="Escribe cómo te sientes hoy..."
            />

            <div className="mt-4">
                <Button
                    label={loading ? "Analizando..." : "Analizar y Guardar"}
                    onClick={handleGuardar}
                    disabled={loading || !texto.trim()} // Deshabilitar si no hay texto
                />
            </div>

            {resultado && (
                <div className={`mt-6 p-4 border rounded-xl ${
                    resultado.emocion_predominante === "Error"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-blue-100 bg-blue-50 text-gray-700"
                }`}>
                    <p>
                        <strong>Emoción detectada:</strong> {resultado.emocion_predominante}
                    </p>
                    <p>
                        <strong>Resumen:</strong> {resultado.resumen_ia}
                    </p>
                </div>
            )}
        </div>
    );
}