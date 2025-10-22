import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, redirectToHome, redirectToLogin } from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "./app/config";

const PRIVATE_PATHS = ['/', '/account'];
const ADMIN_PATHS = ['/adminpanel'];
const SELLER_PATHS = ['/sellerhub'];
const PUBLIC_PATHS = ['/signup', '/login'];

interface CustomClaims {
  role?: ('admin' | 'seller' | 'buyer')[];
  status?: 'pending_seller' | 'approved_seller';
}

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,



    handleValidToken: async ({token, decodedToken}, headers) => {
      const claims = decodedToken as CustomClaims;
      const isAdmin = claims.role?.includes('admin') ?? false;
      const isApprovedSeller = claims.status === 'approved_seller';

      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request);
      }

      if (ADMIN_PATHS.includes(request.nextUrl.pathname) && !isAdmin) {
        return redirectToHome(request);
      }

      if (SELLER_PATHS.includes(request.nextUrl.pathname) && !isApprovedSeller) {
        return redirectToHome(request);
      }

      return NextResponse.next({
        request: {
          headers
        }
      });
    },
    handleInvalidToken: async (reason) => {
      console.info('Missing or malformed credentials', {reason});

      return redirectToLogin(request, {
        path: '/login',
        publicPaths: PUBLIC_PATHS
      });
    },
    handleError: async (error) => {
      console.error('Unhandled authentication error', {error});
      return redirectToLogin(request, {
        path: '/login',
        publicPaths: PUBLIC_PATHS
      });
    }
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};