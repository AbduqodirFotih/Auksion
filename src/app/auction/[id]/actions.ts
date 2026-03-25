'use server';

import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function placeBidAction(plateId: number, prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'user') {
     return { error: "Faqatgina ro'yxatdan o'tgan oddiy foydalanuvchilar qatnasha oladi." };
  }

  const otherActiveBid = db.prepare(`
    SELECT bids.id FROM bids 
    JOIN plates ON bids.plateId = plates.id
    WHERE bids.userId = ? AND plates.status = 'active' AND plates.id != ?
    LIMIT 1
  `).get(session.id, plateId);

  if (otherActiveBid) {
    return { error: "Siz allaqachon boshqa faol auksionda ishtirok etyapsiz! U auksion tugamaguncha yangi auksionlarda ishtirok eta olmaysiz." };
  }

  const amountString = formData.get('amount')?.toString() || '';
  const amountRaw = amountString.replace(/\\D/g, '');
  if (!amountRaw) return { error: "Noto'g'ri summa formati" };

  const amount = BigInt(amountRaw);
  const plate = db.prepare('SELECT * FROM plates WHERE id = ?').get(plateId) as any;
  if (!plate || plate.status !== 'active') return { error: 'Auksion topilmadi yoki yakunlangan' };
  
  const now = Date.now();
  if (now > plate.endTime) {
     db.prepare('UPDATE plates SET status = ? WHERE id = ?').run('finished', plateId);
     revalidatePath(`/auction/${plateId}`);
     return { error: 'Auksion vaqti tugagan. Qayta yuklang.' };
  }

  const currentPrice = BigInt(plate.currentPrice);
  if (amount <= currentPrice) {
    let reqAmountStr = currentPrice.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ' ');
    return { error: `Taklif summasi ${reqAmountStr} so'mdan yuqori bo'lishi shart` };
  }

  const fiveMin = 5 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;
  let newEndTime = plate.endTime;
  if (plate.endTime - now <= fiveMin) {
    newEndTime += oneHour;
  }

  const transaction = db.transaction(() => {
     db.prepare('INSERT INTO bids (plateId, userId, amount, createdAt) VALUES (?, ?, ?, ?)').run(plateId, session.id, amount.toString(), now);
     db.prepare('UPDATE plates SET currentPrice = ?, endTime = ? WHERE id = ?').run(amount.toString(), newEndTime, plateId);
  });

  try {
    transaction();
    revalidatePath(`/auction/${plateId}`);
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: 'Xatolik yuz berdi' };
  }
}
