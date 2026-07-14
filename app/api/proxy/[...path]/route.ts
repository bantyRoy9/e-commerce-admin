/**
 * API Proxy Route Handler
 * Forwards requests to your backend microservices while adding IAM authentication.
 * This prevents exposing your backend URLs to the client and centralizes auth headers.
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://192.168.1.73:5001/api";
const IAM_URL = process.env.NEXT_PUBLIC_IAM_URL || "https://localhost:5001";

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const targetPath = path.join("/");
    
    // Get session proof from request headers (set by client)
    const sessionProof = request.headers.get("x-session-proof");
    const clientId = request.headers.get("x-client-id");
    
    // Get refresh token from httpOnly cookie (set by IAM service)
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("iam_refresh")?.value;

    // Forward request to backend
    const targetUrl = `${BACKEND_API_URL}/${targetPath}${request.nextUrl.search}`;
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add IAM authentication headers
    if (sessionProof) headers["x-session-proof"] = sessionProof;
    if (clientId) headers["x-client-id"] = clientId;
    if (refreshToken) headers["Cookie"] = `iam_refresh=${refreshToken}`;

    // Copy other relevant headers
    const contentType = request.headers.get("content-type");
    if (contentType) headers["Content-Type"] = contentType;

    const body = request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      credentials: "include",
    });

    const data = await response.text();

    // Create response with same status and headers
    const nextResponse = new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy important headers from backend response
    const importantHeaders = ["content-type", "x-next-session-proof"];
    importantHeaders.forEach((header) => {
      const value = response.headers.get(header);
      if (value) nextResponse.headers.set(header, value);
    });

    return nextResponse;
  } catch (error) {
    console.error("API Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request" },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
