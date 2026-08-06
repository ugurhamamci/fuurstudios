import { NextResponse } from 'next/server';
import { get } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'fuur_secret_key_123';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const admin = await get(`SELECT * FROM admins WHERE username = ?`, [username]);
    
    if (!admin) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 401 });

    if (bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET_KEY, { expiresIn: '24h' });
      return NextResponse.json({ token });
    } else {
      return NextResponse.json({ error: 'Hatalı şifre' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
