import createSupabaseClient from "./lib/supabase";

const protectedRoutes = ["/", "/chat", "/dashboard"];
const publicRoutes = ["/login", "/register"]; // Rutas que no requieren autenticación

export async function onRequest(context, next) {
    const supabase = createSupabaseClient(context);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    const currentPath = context.url.pathname;

    if (!user && protectedRoutes.includes(currentPath)) {
        return context.redirect("/login");
    }

    if (user && publicRoutes.includes(currentPath)) {
        return context.redirect("/");
    }

    context.locals.user = user;
    context.locals.session = session;

    return next();
}