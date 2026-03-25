'use client';

import { useActionState, useState } from 'react';
import { placeBidAction } from './actions';
import { LogIn, ArrowUpCircle } from 'lucide-react';
import Link from 'next/link';
import { formatMoneyString } from '@/lib/utils';

export default function BidClientCard({ plateId, currentPrice, isFinished, session }: { plateId: number, currentPrice: string, isFinished: boolean, session: any }) {
  const placeBidWithId = placeBidAction.bind(null, plateId);
  const [state, formAction, isPending] = useActionState(placeBidWithId, null);
  
  const [amount, setAmount] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\\D/g, '');
    setAmount(val);
  };

  if (!session) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700 text-slate-400">
           <LogIn size={28} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Auksionda ishtirok eting</h3>
        <p className="text-slate-400 mb-8 max-w-sm">Narx taklif qilish va auksionda qatnashish uchun avval tizimga kiring.</p>
        <Link href="/login" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]">
           Kirish / Ro'yxatdan o'tish
        </Link>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20 text-rose-400 shadow-inner">
           <ArrowUpCircle size={28} className="rotate-45" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Auksion Yakunlangan</h3>
        <p className="text-slate-400 mb-0 max-w-sm">Ushbu raqam uchun auksion muddati o'z nihoyasiga yetgan va kimoshuv to'xtatilgan.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
      
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
        <ArrowUpCircle className="text-indigo-400" /> Narx Taklif Qilish
      </h3>
      
      <form action={formAction} className="space-y-6 relative z-10">
        <div>
          <label className="text-sm font-medium text-slate-400 ml-1 mb-2 block">Sizning taklifingiz (faqat raqamlar orqali)</label>
          <div className="relative group">
            <input 
              type="text" 
              inputMode="numeric"
              name="amount" 
              value={amount}
              onChange={handleAmountChange}
              placeholder="Masalan: 12000000"
              required 
              className="w-full pl-5 pr-16 py-4 text-xl bg-slate-950/50 border border-slate-800 rounded-xl text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono font-bold"
            />
            <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-500 font-medium text-lg">
              UZS
            </div>
          </div>
          
          <div className="bg-slate-950/80 p-3 mt-3 rounded-lg border border-slate-800/80">
             <div className="text-sm text-slate-400">Taklif etilayotgan summa formatda:</div>
             <div className="text-lg font-bold text-emerald-400/90 font-mono mt-1">
               {amount ? formatMoneyString(amount) : '0'} <span className="text-sm">UZS</span>
             </div>
          </div>
          
          <div className="text-xs text-slate-500 mt-2 ml-1">
             Hozirgi narxdan balandroq summa kiriting (Xozirgi: {formatMoneyString(currentPrice)} UZS)
          </div>
        </div>

        {state?.error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium flex items-start gap-2">
            <div className="mt-0.5">⚠️</div> {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium flex items-start gap-2">
            <div className="mt-0.5">✅</div> Taklifingiz mos tarzda qo'shildi!
          </div>
        )}

        <button 
          type="submit" 
          disabled={isPending || !amount}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {isPending ? (
            <span className="flex items-center gap-2">Yuborilmoqda...</span>
          ) : (
            <>
              Narxni taklif qilish
              <ArrowUpCircle size={20} className="group-hover:-translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
