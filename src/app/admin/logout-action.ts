'use server';

import { logout as logoutAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function adminLogoutAction() {
  await logoutAuth();
  redirect('/login');
}
