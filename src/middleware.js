import createSupabaseClient from "./lib/supabase";


const protectedRoutes = ["/", "/chat", "/dashboard", "/perfil", "/consejos"];
const publicRoutes = ["/login", "/register"];

export async function onRequest(context, next) {
    const supabase = createSupabaseClient(context);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    const currentPath = context.url.pathname;

    // 1. Si el usuario NO está logueado e intenta acceder a una ruta protegida
    if (!user && protectedRoutes.includes(currentPath)) {
        return context.redirect("/login");
    }

    // 2. Si el usuario SÍ está logueado e intenta acceder a una ruta pública
    if (user && publicRoutes.includes(currentPath)) {
        return context.redirect("/");
    }

    context.locals.user = user;
    context.locals.session = session;

    return next();
}