/**
 * Next.js middleware for route protection.
 * Runs on the edge before pages are rendered.
 * 
 * DISABLED: Using client-side IAMGuard instead for better compatibility with IAM session proofs.
 * Enable this only if you need edge-level protection and know your cookie name.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Middleware disabled - using client-side IAMGuard component instead
  return NextResponse.next();
}

export const config = {
  matcher: [],
  // Matcher disabled since middleware is not active
};
