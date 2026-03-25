'use client';

import { useActionState, useState } from 'react';
import { loginAction } from './actions';
import { Car, Lock, User, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [mode, setMode] = useState<'selection' | 'user' | 'admin'>('selection');

  if (mode === 'selection') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
        <div className="mb-10 text-center items-center flex flex-col">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Car size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">VIP Auksion</h1>
          <p className="text-slate-400 mt-3 text-lg">Tizimga qanday kirmoqchisiz?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
          <button onClick={() => setMode('user')} className="bg-slate-900 border border-slate-800 p-10 rounded-3xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group flex flex-col items-center justify-center gap-6 shadow-xl hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] hover:-translate-y-2">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <User size={36} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">Foydalanuvchi</div>
              <p className="text-slate-400 text-sm">Ismingizni kiritib kimoshuvda erkin ishtirok eting</p>
            </div>
          </button>
          
          <button onClick={() => setMode('admin')} className="bg-slate-900 border border-slate-800 p-10 rounded-3xl hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all group flex flex-col items-center justify-center gap-6 shadow-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:-translate-y-2">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck size={36} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">Administrator</div>
              <p className="text-slate-400 text-sm">Login va parol yordamida tizimni to'liq boshqaring</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
      
      <button onClick={() => setMode('selection')} className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
        <ChevronLeft size={20} /> Orqaga
      </button>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-8">
          
          <div className="mb-8 text-center flex flex-col items-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${mode === 'admin' ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-indigo-500/10 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.2)]'}`}>
              {mode === 'admin' ? <ShieldCheck size={32} /> : <User size={32} />}
            </div>
            <h2 className="text-2xl font-bold text-white">{mode === 'admin' ? "Admin Panel" : "Xush kelibsiz"}</h2>
            <p className="text-slate-400 mt-1">{mode === 'admin' ? "Tizimga kirish" : "Kimoshuv savdosi qatnashchisi"}</p>
          </div>

          <form action={formAction} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">{mode === 'admin' ? 'Login' : 'Ismingizni kiriting'}</label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${mode === 'admin' ? 'group-focus-within:text-emerald-400 text-slate-500' : 'group-focus-within:text-indigo-400 text-slate-500'}`}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  defaultValue={mode === 'admin' ? "admin" : ""}
                  placeholder={mode === 'admin' ? "admin" : "Murodjon"}
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all focus:bg-slate-900 ${mode === 'admin' ? 'focus:ring-emerald-500/50 focus:border-emerald-500' : 'focus:ring-indigo-500/50 focus:border-indigo-500'}`}
                />
              </div>
            </div>

            {mode === 'admin' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Parol</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    defaultValue="1234"
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all focus:bg-slate-900"
                  />
                </div>
              </div>
            )}

            {state?.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-3 px-4 text-white font-medium rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group ${mode === 'admin' ? 'bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.3)]'}`}
            >
              {isPending ? 'Kirilmoqda...' : 'Tizimga kirish'}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
