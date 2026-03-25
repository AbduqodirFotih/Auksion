import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Clock, History, AlertCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import BidClientCard from './BidClientCard';
import AdminControlsCard from './AdminControlsCard';
import { formatMoneyString } from '@/lib/utils';
import CountdownTimer from '@/components/CountdownTimer';

export default async function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const plateId = parseInt(resolvedParams.id, 10);
  if (isNaN(plateId)) notFound();

  const plate = db.prepare('SELECT * FROM plates WHERE id = ?').get(plateId) as any;
  if (!plate) notFound();

  const session = await getSession();

  // Update status if ended
  const now = Date.now();
  if (plate.status === 'active' && now > plate.endTime) {
    db.prepare('UPDATE plates SET status = ? WHERE id = ?').run('finished', plateId);
    plate.status = 'finished';
  }

  const bids = db.prepare(`
    SELECT bids.*, users.name as userName 
    FROM bids 
    JOIN users ON bids.userId = users.id 
    WHERE plateId = ? 
    ORDER BY amount DESC
  `).all(plateId) as any[];

  const isFinished = plate.status === 'finished';

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium mb-8 transition-colors">
           <ChevronLeft size={20} />
           Ortga qaytish
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
               
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                   <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700 shadow-inner text-2xl">
                     {plate.regionCode}
                   </div>
                   <span className="font-mono text-4xl md:text-5xl font-bold tracking-widest text-white drop-shadow-lg">
                     {plate.number}
                   </span>
                 </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/80 shadow-inner">
                    <div className="text-slate-400 text-sm mb-2 font-medium">Hozirgi yetakchi narx</div>
                    <div className="text-4xl font-bold text-emerald-400 font-mono tracking-tight flex items-baseline gap-2">
                       {formatMoneyString(plate.currentPrice)} <span className="text-xl text-emerald-500/50">UZS</span>
                    </div>
                  </div>

                  <div className={`rounded-2xl p-5 flex items-center justify-between border ${isFinished ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                     <div className="flex items-center gap-3">
                       <Clock size={24} className={!isFinished ? "animate-pulse" : ""} />
                       <div className="font-medium">
                         <div className="text-xs uppercase tracking-wider opacity-80 mb-1">{isFinished ? 'Tugagan vaqti' : 'Tugash vaqti'}</div>
                         <div className="text-lg">
                            <CountdownTimer endTime={plate.endTime} isFinished={isFinished} />
                            <div className="text-xs opacity-60 mt-1">({new Date(plate.endTime).toLocaleString('ru-RU')})</div>
                         </div>
                       </div>
                     </div>
                  </div>
               </div>
            </div>

            {session?.role === 'admin' ? (
              <AdminControlsCard plate={plate} />
            ) : (
              <BidClientCard plateId={plateId} currentPrice={plate.currentPrice} isFinished={isFinished} session={session} />
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col max-h-[600px]">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <History className="text-indigo-400" /> Tarix ({bids.length})
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
               {bids.map((bid, i) => (
                 <div key={bid.id} className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                         {i + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium">{bid.userName}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{new Date(bid.createdAt).toLocaleString('ru-RU')}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      {formatMoneyString(bid.amount)}
                    </div>
                 </div>
               ))}
               
               {bids.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-center py-12">
                   <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 text-slate-500">
                      <AlertCircle size={28} />
                   </div>
                   <div className="text-slate-400 font-medium">Hali hech qanday taklif tushmagan</div>
                   <div className="text-slate-500 text-sm mt-1">Birinchi bo'lib taklif kiriting!</div>
                 </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
