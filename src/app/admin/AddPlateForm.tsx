'use client';

import { useActionState } from 'react';
import { addPlate } from './actions';
import { Plus } from 'lucide-react';

export default function AddPlateForm() {
  const [state, formAction, isPending] = useActionState(addPlate, null);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-slate-400 ml-1">Hudud kodi (masalan: 01)</label>
        <input name="regionCode" placeholder="01" required className="w-full mt-2 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400 ml-1">Raqam (masalan: 777 AA)</label>
        <input name="number" placeholder="777 AA" required className="w-full mt-2 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono uppercase" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-400 ml-1">Boshlang'ich narx</label>
        <div className="relative mt-2">
          <input type="number" name="startingPrice" placeholder="5000000" required min="1000" className="w-full pl-4 pr-16 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono" />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 font-medium">
            UZS
          </div>
        </div>
      </div>

      {state?.error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium">
          {state.error}
        </div>
      )}
      
      {state?.success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium">
          Muvaqqiyatli qo'shildi!
        </div>
      )}

      <button type="submit" disabled={isPending} className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-70">
        <Plus size={20} /> {isPending ? "Qo'shilmoqda..." : "Bazada qo'shish"}
      </button>
    </form>
  );
}
