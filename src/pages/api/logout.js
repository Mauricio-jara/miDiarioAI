// ruta: mauricio-jara/midiarioai/miDiarioAI-lucas/src/pages/api/logout.js
import createSupabaseClient from "../../lib/supabase";

// (NUEVO Y MUY IMPORTANTE)
// Esto le dice a Astro que esta ruta es dinámica (server-rendered)
// y no estática. Es necesario para manejar POST y cookies.
export const prerender = false;

export async function POST(context) {
    // 1. Inicializamos el cliente con el contexto
    // Esto le da acceso a las cookies de la petición
    const supabase = createSupabaseClient(context);

    // 2. Cerramos la sesión
    // Al estar inicializado con el 'context', el helper de Supabase
    // (configurado en supabase.js) encontrará y borrará
    // las cookies de sesión automáticamente.
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error en supabase.auth.signOut():", error.message);
        // Aun así, intentamos redirigir
    }

    // 3. Redirigir al login.
    // Esta respuesta incluirá las cabeceras Set-Cookie
    // generadas por supabase.auth.signOut() para borrar la sesión.
    return context.redirect("/login");
}