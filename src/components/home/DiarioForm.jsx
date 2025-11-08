import { useState } from "react";
import Button from "../ui/Button.jsx";
import InputArea from "../ui/InputArea.jsx";
import { useApi } from "../../hooks/useApi";

export default function DiarioForm() {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState(null);
  const { guardarEntrada, loading } = useApi();
  const usuario_id = "c1b8e6d0-0000-0000-0000-000000000001"; // Reemplázalo con ID real (o auth de Supabase)

  const handleGuardar = async () => {
    if (!texto.trim()) return;
    const res = await guardarEntrada(usuario_id, texto);
    setResultado(res);
    setTexto("");
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
          disabled={loading}
        />
      </div>

      {resultado && (
        <div className="mt-6 p-4 border border-blue-100 bg-blue-50 rounded-xl text-gray-700">
          <p>
            <strong>Emoción detectada:</strong> {resultado.emocion_predominante}
          </p>
          <p>
            <strong>Resumen:</strong> {resultado.resumen}
          </p>
        </div>
      )}
    </div>
  );
}
