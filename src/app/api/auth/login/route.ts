import { NextResponse } from 'next/server';
import { get } from '@/lib/db';
import { signToken } from '@/lib/auth';
import {
  checkLoginLimit,
  clearLoginAttempts,
  clientIp,
  pruneLoginAttempts,
  recordFailedLogin,
} from '@/lib/rateLimit';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre gerekli' }, { status: 400 });
    }

    await pruneLoginAttempts();

    const ip = clientIp(req);
    const userKey = `user:${String(username).toLowerCase()}`;
    const ipKey = `ip:${ip}`;

    // Hem hesap hem IP için sınır: tek IP'den kullanıcı adı taramak da,
    // dağıtık şekilde tek hesaba yüklenmek de engellenir.
    for (const key of [userKey, ipKey]) {
      const limit = await checkLoginLimit(key);
      if (limit.blocked) {
        return NextResponse.json(
          {
            error: `Çok fazla hatalı deneme yapıldı. ${limit.retryAfterMinutes} dakika sonra tekrar deneyin.`,
          },
          { status: 429, headers: { 'Retry-After': String(limit.retryAfterMinutes * 60) } }
        );
      }
    }

    const admin = await get(`SELECT * FROM admins WHERE username = ?`, [username]);

    // Kullanıcı adının var olup olmadığını sızdırmamak için tek bir mesaj kullanılır.
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      await recordFailedLogin(userKey);
      await recordFailedLogin(ipKey);
      const left = await checkLoginLimit(userKey);
      return NextResponse.json(
        {
          error:
            left.remaining > 0
              ? `Kullanıcı adı veya şifre hatalı. ${left.remaining} denemeniz kaldı.`
              : 'Kullanıcı adı veya şifre hatalı.',
        },
        { status: 401 }
      );
    }

    await clearLoginAttempts(userKey);
    await clearLoginAttempts(ipKey);

    const token = signToken({ id: admin.id, username: admin.username });
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
