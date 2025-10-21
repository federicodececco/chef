import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export interface AuthUser {
  userId: string;
  email: string;
  isChef: boolean;
}

/**
 * Get the current authenticated user from server components or API routes
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email!,
    isChef: false, // TODO: Check from database
  };
}

/**
 * Require authentication in API routes
 * Returns user or null if not authenticated
 */
export async function requireAuth(
  request: NextRequest,
): Promise<AuthUser | null> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email!,
    isChef: false, // TODO: Check from database
  };
}

/**
 * Require chef authentication in API routes
 * Returns user if authenticated and is a chef, null otherwise
 */
export async function requireChef(
  request: NextRequest,
): Promise<AuthUser | null> {
  const user = await requireAuth(request);

  if (!user || !user.isChef) {
    return null;
  }

  return user;
}
