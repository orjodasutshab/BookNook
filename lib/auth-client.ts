import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// typed loosely: plugin generics can resolve to `never` on some better-auth versions
export const authClient: any = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [jwtClient()],
});
