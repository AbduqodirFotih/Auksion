import db from '@/lib/db';
import AddPlateForm from './AddPlateForm';
import { Plus, Car, Trash2, StopCircle, PlayCircle, Edit } from 'lucide-react';
import { finishPlate, deletePlate, reactivatePlate } from './actions';
import { formatMoneyString } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminDashboard() {
  const plates = [...db.plates].sort((a: any, b: any) => {
    if (a.regionCode !== b.regionCode) return a.regionCode.localeCompare(b.regionCode);
    return a.number.localeCompare(b.number);
  });
  
  const platesWithBids = plates.map(plate => {
    const bids = db.bids
      .filter((b: any) => b.plateId === plate.id)
      .map((b: any) => {
        const user = db.users.find((u: any) => u.id === b.userId);
        return {
          amount: b.amount,
          createdAt: b.createdAt,
          userName: user?.name || 'Unknown'
        };
      })
      .sort((a: any, b: any) => Number(b.amount) - Number(a.amount));
    return { ...plate, bids };
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Raqamlar Ro'yxati</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.2)] order-2 xl:order-1">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="text-indigo-400" /> Yangi Raqam
          </h2>
          <AddPlateForm />
        </div>

        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.2)] order-1 xl:order-2 overflow-hidden">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Car className="text-indigo-400" /> Barcha raqamlar ro'yxati
          </h2>
          <div className="overflow-x-auto mx(-6) px-6">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-slate-800">
                  <th className="pb-4 font-medium px-2">Vil/Raqam</th>
                  <th className="pb-4 font-medium px-2">Narx</th>
                  <th className="pb-4 font-medium px-2 w-[250px]">Takliflar tarixi</th>
                  <th className="pb-4 font-medium px-2 text-right">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="text-slate-300 divide-y divide-slate-800/60">
                {platesWithBids.map((plate) => (
                  <tr key={plate.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700 shadow-inner">
                          {plate.regionCode}
                        </div>
                        <span className="font-mono text-lg font-bold tracking-widest text-white">
                          {plate.number}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="font-medium text-emerald-400">{formatMoneyString(plate.startingPrice)} UZS</div>
                      <div className="text-xs text-slate-500 mt-1">Yetakchi: <span className="text-emerald-500 font-bold">{formatMoneyString(plate.currentPrice)}</span></div>
                    </td>
                    <td className="py-4 px-2">
                      {plate.bids.length > 0 ? (
                        <details className="text-sm cursor-pointer group/details outline-none">
                          <summary className="font-medium text-indigo-400 hover:text-indigo-300 outline-none select-none list-none flex items-center gap-2">
                             Takliflarni ko'rish ({plate.bids.length})
                          </summary>
                          <div className="mt-2 space-y-2 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 max-h-40 overflow-y-auto">
                            {plate.bids.map((bid: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-800/50 last:border-0 pb-1 last:pb-0">
                                <span className="font-medium text-slate-300">{idx+1}. {bid.userName}</span>
                                <span className="font-mono text-emerald-400 font-bold">{formatMoneyString(bid.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Takliflar yo'q</span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex flex-col gap-2 items-end">
                        {plate.status === 'active' ? (
                          <div className="flex items-center gap-2">
                             <span className="text-sky-400 font-medium text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>Faol</span>
                             <form action={async () => { 'use server'; await finishPlate(plate.id); }}>
                               <button className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-2 py-1 rounded transition-colors flex items-center gap-1 border border-rose-500/20">
                                 <StopCircle size={12}/> To'xtatish
                               </button>
                             </form>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                             <span className="text-rose-400 font-medium text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>{plate.status === 'finished' ? 'Tugagan' : 'Nofaol'}</span>
                             <form action={async () => { 'use server'; await reactivatePlate(plate.id); }}>
                               <button className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded transition-colors flex items-center gap-1 border border-emerald-500/20">
                                 <PlayCircle size={12}/> Davom etish
                               </button>
                             </form>
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-1 justify-end">
                          <Link href={`/admin/edit/${plate.id}`} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                             <Edit size={12}/> Tahrirlash
                          </Link>
                          <form action={async () => { 'use server'; await deletePlate(plate.id); }}>
                             <button className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors">
                                <Trash2 size={12}/> O'chirish
                             </button>
                          </form>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {platesWithBids.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      Raqamlar mavjud emas. Yangi qo'shing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
