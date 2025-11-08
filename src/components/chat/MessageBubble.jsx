export default function MessageBubble({ rol, texto }) {
  const isUser = rol === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-blue-50 text-gray-700 rounded-bl-none"
        }`}
      >
        {texto}
      </div>
    </div>
  );
}
