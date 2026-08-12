import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export class UploadError extends Error {}

/** Görseller belleğe alınıp diske yazıldığı için üst sınır şart. */
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Yüklenen görseli public/uploads altına kaydeder ve public URL'ini döner.
 * Dosya yoksa ya da boşsa null döner (düzenlemede görsel zorunlu değil).
 */
export const saveImage = async (file: File | null, prefix: string): Promise<string | null> => {
  if (!file || typeof file === 'string' || file.size === 0) return null;

  if (!file.type.startsWith('image/')) {
    throw new UploadError('Sadece görsel dosyaları yüklenebilir.');
  }

  if (file.size > MAX_BYTES) {
    throw new UploadError(
      `Görsel çok büyük (${(file.size / 1024 / 1024).toFixed(1)} MB). En fazla ${MAX_BYTES / 1024 / 1024} MB yükleyebilirsiniz.`
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'png';
  const filename = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return '/uploads/' + filename;
};
