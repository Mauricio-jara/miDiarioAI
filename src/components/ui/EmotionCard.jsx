export default function EmotionCard({ emociones = [] }) {
  const defaultEmociones = [
    { nombre: "Alegría", emoji: "😊", color: "text-yellow-500" },
    { nombre: "Calma", emoji: "😌", color: "text-blue-400" },
    { nombre: "Estrés", emoji: "😣", color: "text-red-400" },
    { nombre: "Gratitud", emoji: "🩵", color: "text-green-500" },
  ];

  const lista = emociones?.length ? emociones : defaultEmociones;

  return (
    <div className="w-full bg-white/70 rounded-2xl shadow-sm p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700">Mis Emociones Recientes</h3>
        <span className="text-gray-400 text-sm">ℹ️</span>
      </div>
      <div className="flex justify-around">
        {lista.map((e, i) => (
          <div key={i} className="flex flex-col items-center text-sm">
            <span className={`text-3xl ${e.color}`}>{e.emoji}</span>
            <span className="text-gray-600 mt-1">{e.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
