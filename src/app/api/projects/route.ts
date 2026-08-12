import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { saveImage, UploadError } from '@/lib/upload';

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
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const meta_title = formData.get('meta_title') as string;
    const meta_description = formData.get('meta_description') as string;

    if (!title || !category) {
      return NextResponse.json({ error: 'Proje adı ve kategori zorunlu.' }, { status: 400 });
    }

    const imageUrl = (await saveImage(formData.get('image') as File | null, 'project')) || '';

    await run(
      `INSERT INTO projects (title, category, description, meta_title, meta_description, image) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, category, description, meta_title, meta_description, imageUrl]
    );

    return NextResponse.json({ message: 'Proje eklendi' }, { status: 201 });
  } catch (err: any) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
