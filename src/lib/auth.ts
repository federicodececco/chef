import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import bcryptjs from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production",
);

const TOKEN_NAME = "auth_token";

export interface JWTPayloadInterface {
  userId: string;
  email: string;
  isChef: boolean;
}

export async function generateToken(
  payload: JWTPayloadInterface,
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("3d")
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string,
): Promise<JWTPayloadInterface | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as JWTPayloadInterface;
  } catch (err) {
    console.error(err);
    return null;
  }
}
export async function hashPassword(password: string): Promise<string> {
  return await bcryptjs.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcryptjs.compare(password, hashedPassword);
}

export async function setAuthCookie(token: string) {
  (await cookies()).set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 3,
    path: "/",
  });
}

export async function removeAuthCookie() {
  (await cookies()).delete(TOKEN_NAME);
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME);
  return token?.value || null;
}

export async function getCurrentUser(): Promise<JWTPayloadInterface | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return await verifyToken(token);
}

export async function requireAuth(
  request: NextRequest,
): Promise<JWTPayloadInterface | null> {
  const token = request.cookies.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function requireChef(
  request: NextRequest,
): Promise<JWTPayloadInterface | null> {
  const user = await requireAuth(request);

  if (!user) return null;
  if (!user.isChef) return null;

  return user;
}
