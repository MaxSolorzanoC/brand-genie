import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { AuthRoutes, PublicRoutes, ApiRoutes, ProRoutes } from '@/routes'
import { supabase } from '@/lib/supabase';

export async function middleware (request: NextRequest) {
    const { pathname } = request.nextUrl;

    // //Check if user is signed in
    const token = request.cookies.get('authToken')?.value;
    const {data: user} = await supabase.auth.getUser(token);
    const userId = user.user?.id;

    if(!ApiRoutes.includes(pathname) && !PublicRoutes.includes(pathname) && !AuthRoutes.includes(pathname) && !userId) {
        //User not signed in not allowed route
        return NextResponse.redirect(new URL('/register', request.nextUrl))
    } 
    
    //Get projects owned by user
    const {data: projectsData, error: projectsError} = await supabase.from("projects").select("id").eq("userId", userId);
    if (projectsError) return NextResponse.redirect(new URL('/register', request.nextUrl));

    const projectsIds = projectsData?.map(project => project.id);

    //Check if user is in dashboard
    const dashboardRegex = /^\/dashboard\/([^/]+)/;
    const match = pathname.match(dashboardRegex);

    //User is in dashboard inside a project
    if (match && match[1]) {
        //Deny access if user access to dashboard of an unowned project
        if (!projectsIds?.includes(match[1])){
            return NextResponse.redirect(new URL('/dashboard?q=unauthorized', request.nextUrl))
        }

        //User in pro feature
        if (ProRoutes.some(route => {
            const regex = new RegExp('^' + route.replace(':path*', '.*') + '$');
            return regex.test(pathname);
        })) {
            //Check if user is subscribed
            const {data, error} = await supabase.from("profiles").select("isPro").eq("id", userId).single();
            if (error) return NextResponse.redirect(new URL('/register', request.nextUrl));
          
            if (!data?.isPro) {
                return NextResponse.redirect(new URL('/subscription?q=unauthorized', request.nextUrl))
            }
        }
    }




    // return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}