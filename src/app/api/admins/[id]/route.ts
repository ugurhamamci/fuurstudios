import { NextResponse } from 'next/server';
import { get, run } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { id } = await context.params;

    if (id === '1') {
      return NextResponse.json({ error: 'Ana yönetici hesabı silinemez' }, { status: 400 });
    }
    if (Number(id) === user.id) {
      return NextResponse.json({ error: 'Kendi hesabınızı silemezsiniz' }, { status: 400 });
    }

    const result = await run('DELETE FROM admins WHERE id = ?', [id]);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Yönetici bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Yönetici silindi' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { id } = await context.params;
    const { username, password } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Kullanıcı adı gerekli' }, { status: 400 });
    }
    if (password && password.length < 8) {
      return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı' }, { status: 400 });
    }

    const existing = await get('SELECT id FROM admins WHERE id = ?', [id]);
    if (!existing) {
      return NextResponse.json({ error: 'Yönetici bulunamadı' }, { status: 404 });
    }

    // Şifre boş bırakıldıysa mevcut şifre korunur.
    if (password) {
      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      await run('UPDATE admins SET username = ?, password = ? WHERE id = ?', [username, hash, id]);
    } else {
      await run('UPDATE admins SET username = ? WHERE id = ?', [username, id]);
    }

    return NextResponse.json({ message: 'Yönetici güncellendi' });
  } catch (err: any) {
    if (String(err?.message).includes('UNIQUE')) {
      return NextResponse.json({ error: 'Bu kullanıcı adı zaten kullanılıyor' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}
