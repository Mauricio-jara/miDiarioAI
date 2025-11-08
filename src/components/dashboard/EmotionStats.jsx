import { useEffect, useState } from "react";
import { endpoints } from "../../config/apiConfig.js";

export default function EmotionStats() {
  const [resumen, setResumen] = useState(null);
  const usuario_id = "c1b8e6d0-0000-0000-0000-000000000001";

  useEffect(() => {
    const cargar = async () => {
      const res = await fetch(endpoints.resumen(usuario_id));
      const data = await res.json();
      setResumen(data);
    };
    cargar();
  }, []);

  if (!resumen)
    return (
      <div className="text-gray-500 text-sm text-center py-6">
        Cargando tus métricas emocionales...
      </div>
    );

  return (
    <div className="bg-white/80 p-6 rounded-2xl shadow-md backdrop-blur-md w-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Resumen Emocional ({resumen.periodo})
      </h2>

      <div className="flex justify-around mt-4">
        {Object.entries(resumen.emociones_predominantes || {}).map(
          ([emocion, valor]) => (
            <div key={emocion} className="flex flex-col items-center">
              <span className="text-xl font-semibold text-blue-500">
                {(valor * 100).toFixed(0)}%
              </span>
              <span className="text-gray-600 text-sm capitalize">
                {emocion}
              </span>
            </div>
          )
        )}
      </div>

      <div className="mt-5 bg-blue-50 p-4 rounded-xl text-gray-700 text-sm">
        <p className="font-medium mb-1">
          🧠 Promedio Sentimiento: {resumen.promedio_sentimiento}
        </p>
        <p>{resumen.resumen_periodo}</p>
        <p className="mt-2 text-blue-600">
          💡 {resumen.recomendacion}
        </p>
      </div>
    </div>
  );
}
