import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(1, "La contraseña no puede estar vacía"),
});

// Esquema de registro ADAPTADO para miDiarioAI
export const registerSchema = z.object({
    // Solo pedimos 'nombre' (en lugar de firstName y lastName)
    nombre: z.string().min(1, "Nombre requerido"),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    // Eliminamos 'age' y 'sex'
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});