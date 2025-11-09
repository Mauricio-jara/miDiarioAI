// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const createSupabaseClient = (context) => {
    return createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
        {
            auth: {
                storage: {
                    getItem: (key) => context.cookies.get(key)?.value ?? null,
                    setItem: (key, value) => {
                        context.cookies.set(key, value, {
                            path: "/",
                            maxAge: 60 * 60 * 24 * 365, // 1 año
                            httpOnly: true,
                            secure: import.meta.env.PROD,
                            sameSite: "lax",
                        });
                    },
                    removeItem: (key) => {
                        context.cookies.delete(key, { path: "/" });
                    },
                },
                // Cambia esta línea:
                autoRefreshToken: import.meta.env.PROD, // Antes era 'true'
                persistSession: true,
                detectSessionInUrl: false,
            },
        }
    );
};

export default createSupabaseClient;