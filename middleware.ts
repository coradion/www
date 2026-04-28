import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

const middleware = authkitMiddleware();

export { middleware as default }; // Next.js middleware MUST be default export, but we can name it internally

export const config = { matcher: ['/', '/((?!_next/static|_next/image|favicon.ico).*)'] };
