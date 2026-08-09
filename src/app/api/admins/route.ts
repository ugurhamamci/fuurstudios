import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'fuur_secret_key_123';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY);

    const admins = await query('SELECT id, username FROM admins');
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY);

    const { username, password } = await req.json();
    if (!username || !password) return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await run('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hash]);
    return NextResponse.json({ message: 'Yönetici eklendi' });
  } catch (error) {
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}
