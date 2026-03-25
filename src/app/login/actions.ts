'use server';

import { login } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const name = formData.get('name')?.toString() || '';
  const password = formData.get('password')?.toString() || '';
  
  const res = await login(name, password);
  if (!res.success) {
    return { error: res.error as string };
  }
  
  if (res.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/');
  }
}
