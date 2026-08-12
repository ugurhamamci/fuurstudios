import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const admins = await query('SELECT id, username FROM admins ORDER BY id ASC');
    return NextResponse.json(admins);
  } catch (err: any) {
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre zorunlu' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı' }, { status: 400 });
    }

    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    await run('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hash]);

    return NextResponse.json({ message: 'Yönetici eklendi' }, { status: 201 });
  } catch (err: any) {
    if (String(err?.message).includes('UNIQUE')) {
      return NextResponse.json({ error: 'Bu kullanıcı adı zaten kullanılıyor' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}
