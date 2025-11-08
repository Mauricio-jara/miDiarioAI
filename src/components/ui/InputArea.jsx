export default function InputArea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Escribe aquí tu entrada de hoy..."}
      className="w-full h-40 p-4 rounded-2xl border border-gray-200 text-gray-700 resize-none shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/80 backdrop-blur-md"
    />
  );
}
