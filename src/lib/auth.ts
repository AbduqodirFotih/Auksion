import { cookies } from 'next/headers';
import db from './db';

export async function login(name: string, password?: string) {
  if (name === 'admin') {
    if (password === '1234') {
      (await cookies()).set('session', 'admin', { httpOnly: true, path: '/' });
      return { success: true, role: 'admin' };
    }
    return { success: false, error: 'Xato parol' };
  }

  if (name.trim() === '') {
    return { success: false, error: 'Ismni kiriting' };
  }

  // 🔥 VERCEL FIX
  if (!db) {
    return { success: false, error: "Serverda database mavjud emas" };
  }

  let user = db.prepare('SELECT * FROM users WHERE name = ?').get(name) as any;

  if (!user) {
    const result = db.prepare('INSERT INTO users (name, role) VALUES (?, ?)')
      .run(name, 'user');

    user = { id: result.lastInsertRowid, name, role: 'user' };
  }

  (await cookies()).set('session', `user:${user.id}`, { httpOnly: true, path: '/' });
  return { success: true, role: 'user' };
}

export async function logout() {
  (await cookies()).delete('session');
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get('session')?.value;

  if (!sessionData) return null;

  // 🔥 VERCEL FIX
  if (!db) {
    return null;
  }

  if (sessionData === 'admin') {
    const admin = db.prepare('SELECT * FROM users WHERE name = ?').get('admin') as any;
    return admin;
  }

  if (sessionData.startsWith('user:')) {
    const userId = sessionData.split(':')[1];
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    if (user) return user;
  }

  return null;
}