import { cookies } from 'next/headers';
import db from './db';

type Session = {
  id: number;
  name: string;
  role: string;
};

const ADMIN_PASSWORD = '1234';

export async function login(name: string, password: string) {
  'use server';
  
  if (!name || name.trim() === '') {
    return { success: false, error: 'Ismingizni kiritib bering' };
  }

  if (name === 'admin') {
    if (password !== ADMIN_PASSWORD) {
      return { success: false, error: 'Parol noto\'g\'ri' };
    }
    const user = db.users.find((u: any) => u.name === 'admin');
    if (user) {
      try {
        const cookieStore = await cookies();
        cookieStore.set(
          'session',
          JSON.stringify({ id: user.id, name: user.name, role: user.role }),
          { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
          }
        );
      } catch (e) {
        // Silently fail
      }
      return { success: true, role: user.role };
    }
  }

  const user = db.users.find((u: any) => u.name === name);
  if (user) {
    try {
      const cookieStore = await cookies();
      cookieStore.set(
        'session',
        JSON.stringify({ id: user.id, name: user.name, role: user.role }),
        { 
          httpOnly: false,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7
        }
      );
    } catch (e) {
      // Silently fail
    }
    return { success: true, role: user.role };
  }

  const newUserId = Math.max(...db.users.map((u: any) => u.id), 0) + 1;
  const newUser = { id: newUserId, name: name.trim(), role: 'user' };
  db.users.push(newUser);

  try {
    const cookieStore = await cookies();
    cookieStore.set(
      'session',
      JSON.stringify(newUser),
      { 
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      }
    );
  } catch (e) {
    // Silently fail
  }

  return { success: true, role: 'user' };
}

export async function logout() {
  'use server';
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
  } catch (e) {
    // Silently fail
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionData = cookieStore.get('session')?.value;
    
    if (!sessionData) return null;
    return JSON.parse(sessionData) as Session;
  } catch (error) {
    return null;
  }
}
