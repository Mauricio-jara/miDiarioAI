import { createContext, useContext, useState } from "react";

const EmotionContext = createContext();

export const EmotionProvider = ({ children }) => {
  const [emociones, setEmociones] = useState([]);

  const agregarEmocion = (nueva) => {
    setEmociones((prev) => [...prev, nueva]);
  };

  return (
    <EmotionContext.Provider value={{ emociones, agregarEmocion }}>
      {children}
    </EmotionContext.Provider>
  );
};

export const useEmociones = () => useContext(EmotionContext);
