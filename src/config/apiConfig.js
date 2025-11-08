export const API_BASE_URL = "http://127.0.0.1:8000";

export const endpoints = {
  chat: `${API_BASE_URL}/chat/enviar`,
  historial: (id) => `${API_BASE_URL}/chat/historial/${id}`,
  diario: `${API_BASE_URL}/diario/entrada`,
  resumen: (id) => `${API_BASE_URL}/diario/resumen/${id}`
};
