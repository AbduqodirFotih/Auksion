'use client';
import { useTransition } from 'react';
import { deletePlate, finishPlate, toggleStatus, addTime } from '@/app/admin/actions';
import { StopCircle, Trash2, Clock, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminControlsCard({ plate }: { plate: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAction = (actionFn: () => Promise<any>) => {
    startTransition(async () => {
       const res = await actionFn();
       if (res?.success) {
           router.refresh();
       } else if (res?.error) {
           alert(res.error);
       }
    });
  }

  return (
    <div className="bg-slate-900 border border-emerald-500/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        Auksion Boshqaruvi (Admin)
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <button 
           onClick={() => handleAction(() => finishPlate(plate.id))}
           disabled={plate.status === 'finished' || isPending}
           className="bg-emerald-600 hover:bg-emerald-500 text-sm disabled:opacity-50 p-4 rounded-xl font-bold text-white flex flex-col items-center gap-2 text-center"
        >
          <StopCircle /> G'olibni tasdiqlash va auksionni tugatish
        </button>
        
        <button 
           onClick={() => handleAction(() => toggleStatus(plate.id))}
           disabled={plate.status === 'finished' || isPending}
           className="bg-indigo-600 hover:bg-indigo-500 text-sm disabled:opacity-50 p-4 rounded-xl font-bold text-white flex flex-col items-center gap-2 text-center"
        >
          {plate.status === 'active' ? <StopCircle /> : <PlayCircle />}
          {plate.status === 'active' ? 'Nofaol qilish (Pauza)' : 'Aktiv qilish (Davom)'}
        </button>

        <button 
           onClick={() => {
              const minutes = prompt("Necha daqiqa qo'shmoqchisiz?", '60');
              if (minutes && !isNaN(Number(minutes))) {
                 handleAction(() => addTime(plate.id, parseInt(minutes)));
              }
           }}
           disabled={plate.status === 'finished' || isPending}
           className="bg-sky-600 hover:bg-sky-500 text-sm disabled:opacity-50 p-4 rounded-xl font-bold text-white flex flex-col items-center gap-2"
        >
          <Clock /> Vaqtni uzaytirish
        </button>

        <button 
           onClick={() => {
             if (confirm("Ushbu auksion butunlay o'chiriladi. Qaroringiz qat'iymi?")) {
               handleAction(async () => {
                 await deletePlate(plate.id);
                 router.push('/');
                 return { success: true };
               });
             }
           }}
           disabled={isPending}
           className="bg-rose-600 hover:bg-rose-500 text-sm disabled:opacity-50 p-4 rounded-xl font-bold text-white flex flex-col items-center gap-2"
        >
          <Trash2 /> O'chirish
        </button>
      </div>
    </div>
  );
}
