import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/uploadthing', '/api/webhook'])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

// For anyone in 2025 having issues with uploading pics with Next js 15. My workaround is include api/uploading route in my middleware public route...
// ```
// const isPublicRoute = createRouteMatcher([
//   '/sign-in(.*)',
//   '/sign-up(.*)',
//   '/api/uploadthing(.*)',
// ])

// # hydration issue with MuxPlayer, you can import using 

// import dynamic from "next/dynamic"

// const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { 
//   ssr: false 
// })