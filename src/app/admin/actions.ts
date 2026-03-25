'use server';

import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// ✅ ADD PLATE
export async function addPlate(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return { error: 'Ruxsat etilmagan' };
  }

  const number = formData.get('number')?.toString() || '';
  const regionCode = formData.get('regionCode')?.toString() || '';
  const startingPrice = formData.get('startingPrice')?.toString().replace(/\D/g, '') || '0';

  if (!number || !regionCode || startingPrice === '0') {
    return { error: "Barcha maydonlarni to'g'ri to'ldiring" };
  }

  try {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    db.plates.push({
      id: Date.now(),
      number,
      regionCode,
      startingPrice,
      currentPrice: startingPrice,
      endTime: now + sevenDays,
      status: 'active'
    });

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { error: 'Xatolik yuz berdi' };
  }
}

// ✅ FINISH
export async function finishPlate(plateId: number) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Ruxsat etilmagan' };

  const plate = db.plates.find((p: any) => p.id === plateId);
  if (plate) plate.status = 'finished';

  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath(`/auction/${plateId}`);
  return { success: true };
}

// ✅ DELETE
export async function deletePlate(plateId: number) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Ruxsat etilmagan' };

  db.bids = db.bids.filter((b: any) => b.plateId !== plateId);
  db.plates = db.plates.filter((p: any) => p.id !== plateId);

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

// ✅ TOGGLE
export async function toggleStatus(plateId: number) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Ruxsat etilmagan' };

  const plate = db.plates.find((p: any) => p.id === plateId);
  if (!plate || plate.status === 'finished') return { error: 'Auksion tugagan' };

  plate.status = plate.status === 'active' ? 'inactive' : 'active';

  revalidatePath(`/auction/${plateId}`);
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

// ✅ ADD TIME
export async function addTime(plateId: number, minutes: number) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Ruxsat etilmagan' };

  const plate = db.plates.find((p: any) => p.id === plateId);
  if (!plate) return { error: 'Topilmadi' };

  plate.endTime += minutes * 60 * 1000;

  revalidatePath(`/auction/${plateId}`);
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

// ✅ REACTIVATE
export async function reactivatePlate(plateId: number) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Ruxsat etilmagan' };

  const plate = db.plates.find((p: any) => p.id === plateId);
  if (!plate) return { error: 'Topilmadi' };

  const now = Date.now();
  if (plate.endTime <= now) {
    plate.endTime = now + (24 * 60 * 60 * 1000);
  }
  plate.status = 'active';

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

// ✅ EDIT PLATE
export async function editPlateAction(plateId: number, prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return { error: 'Ruxsat etilmagan' };
  }

  const number = formData.get('number')?.toString() || '';
  const regionCode = formData.get('regionCode')?.toString() || '';
  const startingPrice = formData.get('startingPrice')?.toString().replace(/\D/g, '') || '0';

  if (!number || !regionCode || startingPrice === '0') {
    return { error: "Barcha maydonlarni to'g'ri to'ldiring" };
  }

  try {
    const plate = db.plates.find((p: any) => p.id === plateId);
    if (!plate) return { error: 'Raqam topilmadi' };

    plate.number = number;
    plate.regionCode = regionCode;
    plate.startingPrice = startingPrice;

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { error: 'Xatolik yuz berdi' };
  }
}