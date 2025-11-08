export default function Button({ label, onClick, type = "button", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-xl text-white font-medium transition-all ${
        disabled
          ? "bg-blue-300 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 active:scale-95 shadow-md"
      }`}
    >
      {label}
    </button>
  );
}
