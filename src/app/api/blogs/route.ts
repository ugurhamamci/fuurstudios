import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { saveImage, UploadError } from '@/lib/upload';

export async function GET() {
  try {
    const blogs = await query('SELECT * FROM blogs ORDER BY created_at DESC');
    return NextResponse.json(blogs);
  } catch (err: any) {
    return NextResponse.json({ error: 'Veritabanı hatası' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const date = formData.get('date') as string;
    const meta_title = formData.get('meta_title') as string;
    const meta_description = formData.get('meta_description') as string;

    if (!title || !category) {
      return NextResponse.json({ error: 'Başlık ve kategori zorunlu.' }, { status: 400 });
    }

    const imageUrl = (await saveImage(formData.get('image') as File | null, 'blog')) || '';

    await run(
      `INSERT INTO blogs (title, excerpt, content, category, date, image, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, excerpt, content, category, date, imageUrl, meta_title, meta_description]
    );

    return NextResponse.json({ message: 'Blog eklendi' }, { status: 201 });
  } catch (err: any) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
