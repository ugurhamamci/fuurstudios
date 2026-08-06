import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { writeFile } from 'fs/promises';
import path from 'path';

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
    const rows = await query(`SELECT * FROM projects ORDER BY id DESC`);
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const meta_title = formData.get('meta_title') as string;
    const meta_description = formData.get('meta_description') as string;
    const file = formData.get('image') as File;

    let imageUrl = '';
    if (file && file.size > 0) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Sadece görsel dosyaları yüklenebilir.' }, { status: 400 });
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'png';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `upload-${uniqueSuffix}.${ext}`;
      const filepath = path.join(process.cwd(), 'public', 'assets', 'images', filename);
      await writeFile(filepath, buffer);
      imageUrl = '/assets/images/' + filename;
    }

    await run(
      `INSERT INTO projects (title, category, description, meta_title, meta_description, image) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, category, description, meta_title, meta_description, imageUrl]
    );

    return NextResponse.json({ message: 'Proje eklendi' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
