import { getSession, logout } from '@/lib/auth';
import db from '@/lib/db';
import Link from 'next/link';
import { formatMoneyString } from '@/lib/utils';
import { Gavel, Clock, LogIn, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';

export default async function HomePage() {
  const session = await getSession();
  
  const now = Date.now();
  db.prepare('UPDATE plates SET status = ? WHERE endTime < ? AND status = ?').run('finished', now, 'active');
  
  const allPlates = db.prepare('SELECT * FROM plates ORDER BY status ASC, endTime ASC').all() as any[];

  const platesWithWinners = allPlates.map(plate => {
    let winner = null;
    if (plate.status === 'finished') {
       winner = db.prepare(`SELECT users.name as userName, bids.amount FROM bids JOIN users ON bids.userId = users.id WHERE plateId = ? ORDER BY amount DESC LIMIT 1`).get(plate.id) as any;
    }
    return { ...plate, winner };
  });

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-6 mb-8 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3 text-white w-full md:w-auto">
          <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Gavel size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">VIP Auksion</h1>
            <p className="text-slate-400 text-sm">Avtomobil raqamlari</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {session ? (
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              <span className="text-slate-300 text-sm md:text-base font-medium bg-slate-900 px-4 py-2 rounded-full border border-slate-800 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                {session.name}
              </span>
              {session.role === 'admin' && (
                <Link href="/admin" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                  <ShieldCheck size={18} /> <span className="hidden sm:inline">Admin Panel</span>
                </Link>
              )}
              <form action={async () => { 'use server'; await logout(); }}>
                 <button className="text-slate-400 hover:text-red-400 transition-colors p-2.5 rounded-full hover:bg-slate-900 focus:ring-2 focus:ring-slate-800">
                   <LogOut size={20} />
                 </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2">
              <LogIn size={18} /> Kirish
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto animate-fade-in-up">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-1.5 h-6 md:w-2 md:h-8 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            Auksionlar ro'yxati
          </h2>
          <span className="text-slate-400 text-sm font-medium bg-slate-900 px-4 py-1.5 rounded-full border border-slate-800/50 shadow-inner">{platesWithWinners.length} ta mavjud</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platesWithWinners.map(plate => (
            <Link href={`/auction/${plate.id}`} key={plate.id} className="group block bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_10_40px_rgba(99,102,241,0.15)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700 shadow-inner text-lg">
                      {plate.regionCode}
                    </div>
                    <span className="font-mono text-3xl font-bold tracking-widest text-white">
                      {plate.number}
                    </span>
                  </div>

                  {plate.status === 'finished' ? (
                    <div className="bg-rose-950/30 rounded-2xl p-4 border border-rose-900/50 shadow-inner">
                      <div className="text-rose-400/80 text-sm mb-1.5 font-medium flex items-center justify-between">
                         Sotilgan narx
                         <span className="text-[10px] uppercase font-bold tracking-wider bg-rose-500/10 text-rose-400 px-2 py-1 rounded">Yakunlangan</span>
                      </div>
                      <div className="text-2xl font-bold text-rose-400 font-mono tracking-tight">
                        {formatMoneyString(plate.currentPrice)} <span className="text-base font-medium text-rose-500/50">UZS</span>
                      </div>
                      {plate.winner ? (
                        <div className="mt-3 pt-3 border-t border-rose-900/50 text-sm flex items-center gap-2">
                          <span className="text-slate-400">G'olib:</span> <span className="font-bold text-white">{plate.winner.userName}</span>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-rose-900/50 text-sm text-slate-500 italic">
                          Hech kim taklif bildirmadi
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50 shadow-inner">
                      <div className="text-slate-400 text-sm mb-1.5 font-medium flex items-center justify-between">
                         Hozirgi narx
                         <span className="flex h-2 w-2 relative">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                         </span>
                      </div>
                      <div className="text-2xl font-bold text-emerald-400 font-mono tracking-tight">
                        {formatMoneyString(plate.currentPrice)} <span className="text-base font-medium text-emerald-500/50">UZS</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-slate-800/80">
                  <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border shadow-inner ${plate.status === 'finished' ? 'bg-slate-800/50 text-slate-400 border-slate-700/50' : 'bg-rose-500/10 text-rose-400/90 border-rose-500/20'}`}>
                    <Clock size={16} />
                    {plate.status === 'finished' ? <span>Auksion yopilgan</span> : <CountdownTimer endTime={plate.endTime} isFinished={plate.status === 'finished'} />}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-indigo-600 flex items-center justify-center text-slate-400 group-hover:text-white transition-all duration-300 shadow-lg">
                    <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {platesWithWinners.length === 0 && (
             <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
               <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <Gavel size={32} className="text-slate-500" />
               </div>
               <h3 className="text-xl font-medium text-slate-300">Hozircha faol auksionlar yo'q</h3>
               <p className="text-slate-500 mt-2 max-w-sm mx-auto">Tez orada yangi avtomobil raqamlari sotuvga qo'yiladi. Bizni kuzatib boring.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
