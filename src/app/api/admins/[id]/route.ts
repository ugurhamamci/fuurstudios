import { NextResponse } from 'next/server';
import { run } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'fuur_secret_key_123';

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY);

    const params = await context.params;
    const id = params.id;

    if (id === '1') {
      return NextResponse.json({ error: 'Ana yönetici hesabı silinemez' }, { status: 400 });
    }

    await run('DELETE FROM admins WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Yönetici silindi' });
  } catch (error) {
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY);

    const params = await context.params;
    const id = params.id;

    const { username, password } = await req.json();
    if (!username) return NextResponse.json({ error: 'Kullanıcı adı gerekli' }, { status: 400 });

    if (password) {
      const salt = require('bcryptjs').genSaltSync(10);
      const hash = require('bcryptjs').hashSync(password, salt);
      await run('UPDATE admins SET username = ?, password = ? WHERE id = ?', [username, hash, id]);
    } else {
      await run('UPDATE admins SET username = ? WHERE id = ?', [username, id]);
    }

    return NextResponse.json({ message: 'Yönetici güncellendi' });
  } catch (error) {
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}
