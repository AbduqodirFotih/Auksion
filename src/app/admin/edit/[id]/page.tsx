import db from '@/lib/db';
import { notFound } from 'next/navigation';
import EditPlateClientForm from './EditPlateClientForm';
import { getSession } from '@/lib/auth';
import { Car, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EditPlatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const plateId = parseInt(resolvedParams.id, 10);
  if (isNaN(plateId)) notFound();

  const session = await getSession();
  if (!session || session.role !== 'admin') return notFound();

  const plate = db.prepare('SELECT * FROM plates WHERE id = ?').get(plateId) as any;
  if (!plate) notFound();

  return (
    <div className="max-w-xl mx-auto space-y-8 mt-10">
      <Link href="/admin" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
         <ChevronLeft size={20} /> Orqaga (Admin Dashboard)
      </Link>
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
           <div className="bg-slate-800 p-2 rounded-lg text-indigo-400 border border-slate-700 shadow-inner">
             <Car size={24} />
           </div>
           Tahrirlash: {plate.regionCode} {plate.number}
        </h1>
        <div className="relative z-10">
          <EditPlateClientForm plate={plate} />
        </div>
      </div>
    </div>
  );
}
