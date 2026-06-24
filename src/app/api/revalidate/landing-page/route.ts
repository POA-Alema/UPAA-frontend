import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  revalidatePath('/');
  revalidatePath('/admin/landing-page');
  return NextResponse.json({ revalidated: true });
}
