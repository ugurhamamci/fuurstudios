import { get, run } from '@/lib/db';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 dakika

export type LimitState = { blocked: boolean; remaining: number; retryAfterMinutes: number };

/**
 * İstemcinin IP adresini çıkarır. Ters vekil (nginx, Cloudflare) arkasında
 * gerçek adres X-Forwarded-For başlığında gelir.
 */
export const clientIp = (req: Request): string => {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip')?.trim() || 'bilinmeyen';
};

/**
 * Pencere içindeki başarısız deneme sayısına bakar. Sayaç hem kullanıcı adı hem
 * IP için ayrı tutulur; böylece tek IP'den farklı kullanıcı adları denemek ya da
 * farklı IP'lerden aynı hesaba yüklenmek ikisi de sınırlanır.
 */
export const checkLoginLimit = async (identifier: string): Promise<LimitState> => {
  const since = Date.now() - WINDOW_MS;

  const row = await get(
    `SELECT COUNT(*) AS count, MIN(attempted_at) AS oldest
       FROM login_attempts
      WHERE identifier = ? AND attempted_at > ?`,
    [identifier, since]
  );

  const count = row?.count ?? 0;
  if (count < MAX_ATTEMPTS) {
    return { blocked: false, remaining: MAX_ATTEMPTS - count, retryAfterMinutes: 0 };
  }

  const unblockAt = (row.oldest ?? Date.now()) + WINDOW_MS;
  const minutes = Math.max(1, Math.ceil((unblockAt - Date.now()) / 60000));
  return { blocked: true, remaining: 0, retryAfterMinutes: minutes };
};

export const recordFailedLogin = async (identifier: string): Promise<void> => {
  await run(`INSERT INTO login_attempts (identifier, attempted_at) VALUES (?, ?)`, [
    identifier,
    Date.now(),
  ]);
};

/** Başarılı girişte o kimliğe ait denemeler sıfırlanır. */
export const clearLoginAttempts = async (identifier: string): Promise<void> => {
  await run(`DELETE FROM login_attempts WHERE identifier = ?`, [identifier]);
};

/** Penceresi geçmiş kayıtları temizler; tablo süresiz büyümesin. */
export const pruneLoginAttempts = async (): Promise<void> => {
  await run(`DELETE FROM login_attempts WHERE attempted_at < ?`, [Date.now() - WINDOW_MS]);
};
