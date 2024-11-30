import {NextRequest} from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
    console.log("middleware")
    console.log(req.url)
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/(.*)',
}