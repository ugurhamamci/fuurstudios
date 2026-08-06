import { NextResponse } from 'next/server';
import { run } from '@/lib/db';

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

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const params = await context.params;
    await run('DELETE FROM blogs WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
