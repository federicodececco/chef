import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const allowedOrigins = [
  "https://chef-nine-fawn.vercel.app",
  "http://localhost:3000",
  process.env.NEXT_PUBLIC_BASE_URL, // Amplify or production domain
].filter(Boolean); // Remove undefined values

function corsHeaders(origin?: string | null) {
  // Only set CORS headers if origin is in allowed list or if no origin (same-origin request)
  const allowedOrigin =
    origin && allowedOrigins.includes(origin)
      ? origin
      : !origin
        ? allowedOrigins[0]
        : null;

  if (!allowedOrigin) {
    // Origin not allowed - return minimal headers
    return {
      "Access-Control-Allow-Origin": allowedOrigins[0],
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
  }

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers,
    });
  }

  // Update Supabase session
  const { response: supabaseResponse } = await updateSession(request);

  Object.entries(headers).forEach(([key, value]) => {
    supabaseResponse.headers.set(key, value);
  });

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
