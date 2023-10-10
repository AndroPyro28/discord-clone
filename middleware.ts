import middleware, {withAuth} from "next-auth/middleware"

export default withAuth(async function middleware(req) {
    console.log('middleware runnnn')
    // const currentUser = await getCurrentUser();

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
        // front end
        '/',
        '/servers/:path*',
        '/invite/:path*',

        // back end
        '/api/servers/:path*',
        '/api/uploadthing/:path*',
        '/api/upload-thing-delete/:path*',
    ],
}