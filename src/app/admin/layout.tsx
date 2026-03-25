import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Home, Crown } from 'lucide-react';
import { adminLogoutAction } from './logout-action';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 text-indigo-400 mb-8 font-bold text-xl">
          <Crown size={24} />
          Admin Panel
        </div>
        
        <nav className="flex-1 space-y-2 mb-8 md:mb-0">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Home size={18} />
            Bosh sahifa
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors">
            Saytga o'tish
          </Link>
        </nav>

        <form action={adminLogoutAction}>
          <button className="w-full flex items-center gap-2 py-3 px-4 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors mt-auto font-medium">
            <LogOut size={18} />
            Chiqish
          </button>
        </form>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
