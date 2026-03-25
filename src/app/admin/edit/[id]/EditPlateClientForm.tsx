'use client';

import { useActionState, useState } from 'react';
import { editPlateAction } from '@/app/admin/actions';
import { formatMoneyString } from '@/lib/utils';
import { Save } from 'lucide-react';

export default function EditPlateClientForm({ plate }: { plate: any }) {
  const updatePlateWithId = editPlateAction.bind(null, plate.id);
  const [state, formAction, isPending] = useActionState(updatePlateWithId, null);
  
  const [startPrice, setStartPrice] = useState(plate.startingPrice);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
           <label className="text-sm font-medium text-slate-300 ml-1">Viloyat</label>
           <input type="text" name="regionCode" defaultValue={plate.regionCode} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white mt-1 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
        </div>
        <div className="col-span-3">
           <label className="text-sm font-medium text-slate-300 ml-1">Raqam</label>
           <input type="text" name="number" defaultValue={plate.number} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white mt-1 uppercase shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono tracking-wider" />
        </div>
      </div>
      <div>
         <label className="text-sm font-medium text-slate-300 ml-1">Boshlang'ich Narx (UZS)</label>
         <input type="text" inputMode="numeric" name="startingPrice" value={startPrice} onChange={(e) => setStartPrice(e.target.value.replace(/\D/g, ''))} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-white mt-1 font-mono shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
         <div className="text-xs text-slate-500 mt-2 ml-1">Hozirgi formatda: <span className="font-bold text-emerald-400/80">{formatMoneyString(startPrice)} UZS</span></div>
      </div>

      {state?.error && (
         <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2">
            <span className="text-lg">⚠️</span> {state.error}
         </div>
      )}
      
      {state?.success && (
         <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
            <span className="text-lg">✅</span> Muftaqqiyatli saqlandi!
         </div>
      )}
      
      <button type="submit" disabled={isPending} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
        <Save size={18} /> {isPending ? 'Saqlanmoqda...' : "O'zgarishlarni Saqlash"}
      </button>
    </form>
  )
}
