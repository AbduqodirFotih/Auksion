'use server';

import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addPlate(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return { error: 'Ruxsat etilmagan' };
  }

  const number = formData.get('number')?.toString() || '';
  const regionCode = formData.get('regionCode')?.toString() || '';
  const startingPrice = formData.get('startingPrice')?.toString().replace(/\\D/g, '') || '0';

  if (!number || !regionCode || startingPrice === '0') {
    return { error: "Barcha maydonlarni to'g'ri to'ldiring" };
  }

  try {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    const insertPlate = db.prepare(`
      INSERT INTO plates (number, regionCode, startingPrice, currentPrice, endTime)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertPlate.run(number, regionCode, startingPrice, startingPrice, now + sevenDays);
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return { error: 'Bu raqam bazada mavjud' };
    }
    return { error: 'Xatolik yuz berdi' };
  }
}

export async function finishPlate(plateId: number) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Ruxsat etilmagan' };
  db.prepare('UPDATE plates SET status = ? WHERE id = ?').run('finished', plateId);
  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath(`/auction/${plateId}`);
  return { success: true };
}

export async function deletePlate(plateId: number) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Ruxsat etilmagan' };
  db.transaction(() => {
    db.prepare('DELETE FROM bids WHERE plateId = ?').run(plateId);
    db.prepare('DELETE FROM plates WHERE id = ?').run(plateId);
  })();
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function toggleStatus(plateId: number) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Ruxsat etilmagan' };
  
  const plate = db.prepare('SELECT status FROM plates WHERE id = ?').get(plateId) as any;
  if (!plate || plate.status === 'finished') return { error: 'Auksion tugagan' };
  
  const newStatus = plate.status === 'active' ? 'inactive' : 'active';
  db.prepare('UPDATE plates SET status = ? WHERE id = ?').run(newStatus, plateId);
  revalidatePath(`/auction/${plateId}`);
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function addTime(plateId: number, minutes: number) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Ruxsat etilmagan' };
  
  const plate = db.prepare('SELECT endTime FROM plates WHERE id = ?').get(plateId) as any;
  if (!plate || !plate.endTime) return { error: 'Topilmadi' };
  
  const newTime = plate.endTime + (minutes * 60 * 1000);
  db.prepare('UPDATE plates SET endTime = ? WHERE id = ?').run(newTime, plateId);
  revalidatePath(`/auction/${plateId}`);
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function reactivatePlate(plateId: number) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Ruxsat etilmagan' };
  
  const plate = db.prepare('SELECT endTime FROM plates WHERE id = ?').get(plateId) as any;
  if (!plate) return { error: 'Topilmadi' };
  
  let newTime = plate.endTime;
  const now = Date.now();
  if (newTime <= now) {
    newTime = now + (24 * 60 * 60 * 1000); // add 24 hours automatically if dead
  }
  
  db.prepare('UPDATE plates SET status = ?, endTime = ? WHERE id = ?').run('active', newTime, plateId);
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function editPlateAction(plateId: number, prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Ruxsat etilmagan' };

  const number = formData.get('number')?.toString() || '';
  const regionCode = formData.get('regionCode')?.toString() || '';
  const startingPrice = formData.get('startingPrice')?.toString().replace(/\D/g, '') || '0';

  if (!number || !regionCode || startingPrice === '0') {
    return { error: "Barcha maydonlarni to'ldiring" };
  }

  try {
    db.prepare(`
      UPDATE plates SET number = ?, regionCode = ?, startingPrice = ? WHERE id = ?
    `).run(number.toUpperCase(), regionCode, startingPrice, plateId);
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath(`/auction/${plateId}`);
    return { success: true };
  } catch(err: any) {
    if (err.message.includes('UNIQUE constraint failed')) return { error: 'Bunday raqam allaqachon mavjud' };
    return { error: 'Xatolik yuz berdi' };
  }
}
