import { NextResponse } from 'next/server';
import { run } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { saveImage, UploadError } from '@/lib/upload';
import { readTeamForm } from '@/lib/team';

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { id } = await context.params;
    const result = await run(`DELETE FROM team_members WHERE id = ?`, [id]);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Ekip üyesi bulunamadı' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Ekip üyesi silindi' });
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
    const f = readTeamForm(formData);

    if (!f.name) {
      return NextResponse.json({ error: 'İsim zorunlu.' }, { status: 400 });
    }

    // Yeni fotoğraf yüklenmediyse mevcut fotoğraf korunur.
    const image = await saveImage(formData.get('image') as File | null, 'team');

    const columns = [
      'name = ?',
      'role = ?',
      'bio = ?',
      'initials = ?',
      'accent_color = ?',
      'linkedin_url = ?',
      'instagram_url = ?',
      'github_url = ?',
      'twitter_url = ?',
      'whatsapp = ?',
      'sort_order = ?',
    ];
    const values: any[] = [
      f.name,
      f.role,
      f.bio,
      f.initials,
      f.accent_color,
      f.linkedin_url,
      f.instagram_url,
      f.github_url,
      f.twitter_url,
      f.whatsapp,
      f.sort_order,
    ];

    if (image) {
      columns.push('image = ?');
      values.push(image);
    }
    values.push(id);

    const result = await run(`UPDATE team_members SET ${columns.join(', ')} WHERE id = ?`, values);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Ekip üyesi bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Ekip üyesi güncellendi' });
  } catch (err: any) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
