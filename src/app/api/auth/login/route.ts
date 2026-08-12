import { NextResponse } from 'next/server';
import { get } from '@/lib/db';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre gerekli' }, { status: 400 });
    }

    const admin = await get(`SELECT * FROM admins WHERE username = ?`, [username]);

    // Kullanıcı adının var olup olmadığını sızdırmamak için tek bir mesaj kullanılır.
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 });
    }

    const token = signToken({ id: admin.id, username: admin.username });
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
