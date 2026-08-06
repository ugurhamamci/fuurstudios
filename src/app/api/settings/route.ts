import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'fuur_secret_key_123';

const verifyToken = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return null;
  }
};

export async function GET() {
  try {
    const rows = await query(`SELECT * FROM settings`);
    const settings: any = {};
    rows.forEach(r => settings[r.setting_key] = r.setting_value);
    return NextResponse.json(settings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const settings = await req.json();
    for (const [key, value] of Object.entries(settings)) {
      await run(`UPDATE settings SET setting_value = ? WHERE setting_key = ?`, [value, key]);
    }
    return NextResponse.json({ message: 'Ayarlar güncellendi' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
