'use server';

import { finishPlate as finish, deletePlate as del, reactivatePlate as react } from './actions';
import { revalidatePath } from 'next/cache';

export async function finishPlateAction(plateId: number) {
  await finish(plateId);
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deletePlateAction(plateId: number) {
  await del(plateId);
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function reactivatePlateAction(plateId: number) {
  await react(plateId);
  revalidatePath('/admin');
  revalidatePath('/');
}
