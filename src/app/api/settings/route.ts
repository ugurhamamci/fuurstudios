import { NextResponse } from 'next/server';
import { getSettings, upsertSetting, DEFAULT_SETTINGS } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    return NextResponse.json(await getSettings());
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const body = await req.json();
    const allowedKeys = Object.keys(DEFAULT_SETTINGS);

    for (const [key, value] of Object.entries(body)) {
      if (!allowedKeys.includes(key)) continue;
      await upsertSetting(key, value == null ? '' : String(value));
    }

    return NextResponse.json({ message: 'Ayarlar güncellendi', settings: await getSettings() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
