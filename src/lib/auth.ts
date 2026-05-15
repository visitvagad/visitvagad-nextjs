'use server';

import { cookies } from 'next/headers';
import { Client, Account } from 'node-appwrite';
import type { AdminRole } from '@/types/admin';

const SESSION_COOKIE = process.env.AUTH_COOKIE_NAME || 'visitvagad_session';

/** Create a server-side Appwrite client using the session cookie */
async function createSessionClient() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setSession(session);

  return { client, account: new Account(client) };
}

/** Get current authenticated user or null */
export async function getUser() {
  try {
    const sessionClient = await createSessionClient();
    if (!sessionClient) return null;
    const user = await sessionClient.account.get();
    return user;
  } catch {
    return null;
  }
}

/** Get user role from Appwrite labels */
export async function getUserRole(): Promise<AdminRole | null> {
  const user = await getUser();
  if (!user) return null;

  const labels = user.labels || [];
  if (labels.includes('super_admin') || labels.includes('superadmin')) return 'super_admin';
  if (labels.includes('admin')) return 'super_admin'; // legacy compat
  if (labels.includes('editor')) return 'editor';
  if (labels.includes('contributor')) return 'contributor';
  return null;
}

/** Require authentication — throws if not authenticated */
export async function requireAuth() {
  const user = await getUser();
  if (!user) throw new Error('UNAUTHORIZED');
  const role = await getUserRole();
  if (!role) throw new Error('FORBIDDEN');
  return { user, role };
}

/** Require specific role */
export async function requireRole(requiredRole: AdminRole) {
  const { user, role } = await requireAuth();
  if (requiredRole === 'super_admin' && role !== 'super_admin') {
    throw new Error('FORBIDDEN');
  }
  if (requiredRole === 'editor' && role === 'contributor') {
    throw new Error('FORBIDDEN');
  }
  return { user, role };
}

/** Login with email/password — sets session cookie */
export async function login(email: string, password: string) {
  const { Account, Client } = await import('node-appwrite');

  // Server SDK needs API key to create sessions on behalf of users
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  const account = new Account(client);
  const session = await account.createEmailPasswordSession(email, password);

  // Verify user has admin/editor role
  const userClient = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setSession(session.secret);

  const userAccount = new Account(userClient);
  const user = await userAccount.get();
  const labels = user.labels || [];

  if (!labels.includes('super_admin') && !labels.includes('superadmin') && !labels.includes('admin') && !labels.includes('editor') && !labels.includes('contributor')) {
    // Delete session if user has no valid role
    await userAccount.deleteSession(session.$id);
    throw new Error('FORBIDDEN');
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  const role = labels.includes('super_admin') || labels.includes('superadmin') || labels.includes('admin')
    ? 'super_admin'
    : labels.includes('editor')
      ? 'editor'
      : 'contributor';
  return { userId: user.$id, role };
}

/** Logout — clears session cookie and deletes Appwrite session */
export async function logout() {
  try {
    const sessionClient = await createSessionClient();
    if (sessionClient) {
      await sessionClient.account.deleteSession('current');
    }
  } catch {
    // Session may already be expired
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Get session info for middleware (lightweight check) */
export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}
