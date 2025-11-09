// ruta: mauricio-jara/midiarioai/miDiarioAI-4ef41acf67fd95861c9f4c8bb8e6ec972e919610/src/components/dashboard/EmotionStats.jsx
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
// (NUEVO) Importar componentes de Recharts
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// (NUEVO) Paleta de colores para el gráfico
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#E36397'];

export default function EmotionStats({ accessToken }) {
    const [resumen, setResumen] = useState(null);
    const { getResumen, loading } = useApi(accessToken);

    useEffect(() => {
        const cargar = async () => {
            if (!accessToken) return;
            try {
                const data = await getResumen();
                setResumen(data);
            } catch (error) {
                console.error("Error al cargar resumen:", error);
                setResumen({ error: "No se pudieron cargar los datos." });
            }
        };
        cargar();
    }, [accessToken, getResumen]);

    // (NUEVO) Transformar los datos para el gráfico
    const chartData = Object.entries(resumen?.conteo_emociones || {}).map(([name, value]) => ({
        // Capitalizar la primera letra
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: value,
    }));

    if (loading || !resumen)
        return (
            <div className="text-gray-500 text-sm text-center py-6">
                Cargando tus métricas emocionales...
            </div>
        );

    if (resumen.error)
        return (
            <div className="bg-white/80 p-6 rounded-2xl shadow-md backdrop-blur-md w-full text-red-500 text-center">
                Error al cargar métricas: {resumen.error}
            </div>
        );

    return (
        <div className="bg-white/80 p-6 rounded-2xl shadow-md backdrop-blur-md w-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Resumen Emocional
            </h2>

            {/* Resumen de IA (que ahora se basa en el sentimiento interpretado) */}
            {resumen.resumen_ia && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-gray-700">
                    <p className="text-sm">{resumen.resumen_ia}</p>
                    <p className="text-sm font-medium text-blue-600 mt-2">💡 {resumen.recomendacion_ia}</p>
                </div>
            )}

            {/* (MODIFICADO) Reemplazamos el desglose de texto por el gráfico */}
            {chartData.length > 0 ? (
                <div className="mt-5">
                    <h3 className="text-md font-semibold text-gray-600 mb-2 text-center">Desglose de Emociones</h3>
                    {/* Contenedor responsivo para el gráfico */}
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    // Etiqueta personalizada
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={80}
                                    innerRadius={40} // <-- Esto lo hace un gráfico de dona
                                    fill="#8884d8"
                                    dataKey="value"
                                    paddingAngle={3}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500 text-center mt-4">
                    Escribe en tu diario para ver tu desglose de emociones.
                </p>
            )}

            {/* (MODIFICADO) Reorganizado para mejor visualización */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-gray-700 text-center">
                    <p className="font-medium text-gray-600">Emoción Frecuente</p>
                    <p className="text-2xl font-semibold text-blue-600 capitalize">{resumen.emocion_mas_frecuente || 'N/A'}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-gray-700 text-center">
                    <p className="font-medium text-gray-600">Total de Entradas</p>
                    <p className="text-2xl font-semibold text-blue-600">{resumen.total_entradas_diario || 0}</p>
                </div>
            </div>

            {/* (MODIFICADO) Mostramos la interpretación */}
            <div className="mt-4 bg-blue-50 p-4 rounded-xl text-gray-700 text-center">
                <p className="font-medium text-gray-600">Sentimiento General</p>
                <p className="text-2xl font-semibold text-blue-600">
                    {resumen.interpretacion_sentimiento || 'Neutral'}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                    (Puntaje numérico: {resumen.promedio_sentimiento_general})
                </p>
            </div>

        </div>
    );
}