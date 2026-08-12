import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { saveImage, UploadError } from '@/lib/upload';
import { readTeamForm } from '@/lib/team';

export async function GET() {
  try {
    const rows = await query(`SELECT * FROM team_members ORDER BY sort_order ASC, id ASC`);
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
    const f = readTeamForm(formData);

    if (!f.name) {
      return NextResponse.json({ error: 'İsim zorunlu.' }, { status: 400 });
    }

    const image = (await saveImage(formData.get('image') as File | null, 'team')) || '';

    await run(
      `INSERT INTO team_members
         (name, role, bio, initials, accent_color, image, linkedin_url, instagram_url, github_url, twitter_url, whatsapp, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        f.name,
        f.role,
        f.bio,
        f.initials,
        f.accent_color,
        image,
        f.linkedin_url,
        f.instagram_url,
        f.github_url,
        f.twitter_url,
        f.whatsapp,
        f.sort_order,
      ]
    );

    return NextResponse.json({ message: 'Ekip üyesi eklendi' }, { status: 201 });
  } catch (err: any) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
