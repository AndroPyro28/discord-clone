import middleware, {withAuth} from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(function middleware(req) {
    // const {pathname} = req.nextUrl

    // const email = req.nextauth.token?.email

    // role based authentication conditional statement
},{
    pages: {
        signIn: '/login',
        
    },
    callbacks: {
       async authorized({token, req}) {
        // we can authorize the client here
        // we can call or setup the app here
        return Boolean(token?.sub)
        },
    }
})

export const config  = {
    matcher: [
        '/'
    ],
}