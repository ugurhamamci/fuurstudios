import { NextResponse } from 'next/server';
import { run } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { saveImage, UploadError } from '@/lib/upload';

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { id } = await context.params;
    const result = await run(`DELETE FROM projects WHERE id = ?`, [id]);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Proje bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Proje silindi' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { id } = await context.params;
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const meta_title = formData.get('meta_title') as string;
    const meta_description = formData.get('meta_description') as string;

    if (!title || !category) {
      return NextResponse.json({ error: 'Proje adı ve kategori zorunlu.' }, { status: 400 });
    }

    // Yeni görsel yüklenmediyse mevcut görsel korunur.
    const imageUrl = await saveImage(formData.get('image') as File | null, 'project');

    const result = imageUrl
      ? await run(
          `UPDATE projects SET title = ?, category = ?, description = ?, meta_title = ?, meta_description = ?, image = ? WHERE id = ?`,
          [title, category, description, meta_title, meta_description, imageUrl, id]
        )
      : await run(
          `UPDATE projects SET title = ?, category = ?, description = ?, meta_title = ?, meta_description = ? WHERE id = ?`,
          [title, category, description, meta_title, meta_description, id]
        );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Proje bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Proje güncellendi' });
  } catch (err: any) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
