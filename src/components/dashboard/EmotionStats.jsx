import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi"; // Importar el hook

// Aceptar 'accessToken'
export default function EmotionStats({ accessToken }) {
    const [resumen, setResumen] = useState(null);

    // Usar el hook con el token y obtener la nueva función
    const { getResumen, loading } = useApi(accessToken);

    useEffect(() => {
        const cargar = async () => {
            if (!accessToken) return;
            try {
                // Usar la nueva función del hook
                const data = await getResumen();
                setResumen(data);
            } catch (error) {
                console.error("Error al cargar resumen:", error);
                setResumen({ error: "No se pudieron cargar los datos." });
            }
        };
        cargar();
    }, [accessToken, getResumen]); // Añadir dependencias

    if (loading || !resumen)
        return (
            <div className="text-gray-500 text-sm text-center py-6">
                Cargando tus métricas emocionales...
            </div>
        );

    // Manejar si el backend devuelve un error
    if (resumen.error)
        return (
            <div className="bg-white/80 p-6 rounded-2xl shadow-md backdrop-blur-md w-full text-red-500 text-center">
                Error al cargar métricas: {resumen.error}
            </div>
        );

    // Adaptamos el JSX a la data real del backend
    return (
        <div className="bg-white/80 p-6 rounded-2xl shadow-md backdrop-blur-md w-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Resumen Emocional
            </h2>

            <p className="text-sm text-gray-600 mb-4">
                Has escrito un total de <span className="font-bold text-blue-600">{resumen.total_entradas_diario || 0}</span> entradas en tu diario.
            </p>

            <div className="flex flex-col sm:flex-row justify-around items-center mt-4 p-4 bg-blue-50 rounded-xl space-y-2 sm:space-y-0">
                <span className="text-gray-700 text-sm">Emoción más frecuente:</span>
                <span className="text-xl font-semibold text-blue-600 capitalize">
          {resumen.emocion_mas_frecuente || 'N/A'}
        </span>
            </div>

            <div className="mt-5 bg-blue-50 p-4 rounded-xl text-gray-700 text-sm">
                <p className="font-medium mb-1">
                    🧠 Promedio Sentimiento General: {resumen.promedio_sentimiento_general}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                    (Un puntaje de -1.0 es muy negativo, y 1.0 es muy positivo)
                </p>
            </div>

            {/* Mostramos el desglose de emociones */}
            {resumen.conteo_emociones && Object.keys(resumen.conteo_emociones).length > 0 && (
                <div className="mt-5">
                    <h3 className="text-md font-semibold text-gray-600 mb-2">Desglose de Emociones:</h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(resumen.conteo_emociones).map(([emocion, valor]) => (
                            <div key={emocion} className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <span className="text-lg font-semibold text-blue-500">
                  {valor}
                </span>
                                <span className="text-gray-600 text-sm capitalize">
                  {emocion}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}