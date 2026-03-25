'use server';

import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function placeBidAction(plateId: number, prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'user') {
    return { error: "Faqatgina ro'yxatdan o'tgan oddiy foydalanuvchilar qatnasha oladi." };
  }

  const amountString = formData.get('amount')?.toString() || '';
  const amountRaw = amountString.replace(/\D/g, '');
  if (!amountRaw) return { error: "Noto'g'ri summa formati" };

  const amount = BigInt(amountRaw);
  const now = Date.now();

  const plate = db.plates.find((p: any) => p.id === plateId);

  const otherActiveBid = db.bids.find((b: any) => {
    const p = db.plates.find((pl: any) => pl.id === b.plateId);
    return b.userId === session.id && p?.status === 'active' && p.id !== plateId;
  });

  if (otherActiveBid) {
    return { error: "Siz allaqachon boshqa faol auksionda ishtirok etyapsiz!" };
  }

  if (!plate || plate.status !== 'active') {
    return { error: 'Auksion topilmadi yoki yakunlangan' };
  }

  if (now > plate.endTime) {
    plate.status = 'finished';
    revalidatePath(`/auction/${plateId}`);
    return { error: 'Auksion vaqti tugagan. Qayta yuklang.' };
  }

  const currentPrice = BigInt(plate.currentPrice);

  if (amount <= currentPrice) {
    let reqAmountStr = currentPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return { error: `Taklif summasi ${reqAmountStr} so'mdan yuqori bo'lishi shart` };
  }

  const fiveMin = 5 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;
  let newEndTime = plate.endTime;

  if (plate.endTime - now <= fiveMin) {
    newEndTime += oneHour;
  }

  try {
    // Add bid
    db.bids.push({
      id: Date.now(),
      plateId,
      userId: session.id,
      amount: amount.toString(),
      createdAt: now
    });

    // Update plate
    plate.currentPrice = amount.toString();
    plate.endTime = newEndTime;

    revalidatePath(`/auction/${plateId}`);
    revalidatePath('/');
    return { success: true };

  } catch (err) {
    return { error: 'Xatolik yuz berdi' };
  }
}