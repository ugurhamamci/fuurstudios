import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

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
    const blogs = await query('SELECT * FROM blogs ORDER BY created_at DESC');
    return NextResponse.json(blogs);
  } catch (err) {
    return NextResponse.json({ error: 'Veritabanı hatası' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const date = formData.get('date') as string;
    const meta_title = formData.get('meta_title') as string;
    const meta_description = formData.get('meta_description') as string;
    const imageFile = formData.get('image') as File | null;

    let imageUrl = '';
    if (imageFile) {
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Sadece görsel dosyaları yüklenebilir.' }, { status: 400 });
      }
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = imageFile.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'png';
      const filename = `blog-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try { await require('fs/promises').mkdir(uploadDir, { recursive: true }); } catch (e) {}
      const uploadPath = path.join(uploadDir, filename);
      await writeFile(uploadPath, buffer);
      imageUrl = '/uploads/' + filename;
    }

    await run(
      `INSERT INTO blogs (title, excerpt, content, category, date, image, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, excerpt, content, category, date, imageUrl, meta_title, meta_description]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
