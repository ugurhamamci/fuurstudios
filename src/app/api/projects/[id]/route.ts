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
    await run(`DELETE FROM projects WHERE id = ?`, [params.id]);
    return NextResponse.json({ message: 'Proje silindi' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const params = await context.params;
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const meta_title = formData.get('meta_title') as string;
    const meta_description = formData.get('meta_description') as string;
    const file = formData.get('image') as File | null;

    if (file && file.size > 0) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Sadece görsel dosyaları yüklenebilir.' }, { status: 400 });
      }
      // User uploaded a new image
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'png';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `upload-${uniqueSuffix}.${ext}`;
      const filepath = require('path').join(process.cwd(), 'public', 'assets', 'images', filename);
      await require('fs/promises').writeFile(filepath, buffer);
      const imageUrl = '/assets/images/' + filename;
      
      await run(
        `UPDATE projects SET title = ?, category = ?, description = ?, meta_title = ?, meta_description = ?, image = ? WHERE id = ?`,
        [title, category, description, meta_title, meta_description, imageUrl, params.id]
      );
    } else {
      // No new image, update other fields only
      await run(
        `UPDATE projects SET title = ?, category = ?, description = ?, meta_title = ?, meta_description = ? WHERE id = ?`,
        [title, category, description, meta_title, meta_description, params.id]
      );
    }

    return NextResponse.json({ message: 'Proje güncellendi' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

