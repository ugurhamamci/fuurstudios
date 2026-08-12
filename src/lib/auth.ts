import jwt from 'jsonwebtoken';

export type AdminToken = { id: number; username: string };

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Bilerek hata fırlatıyoruz: sabit bir yedek anahtar kullanmak, anahtar
    // herkese açık olduğu için panele serbest giriş demek olurdu.
    throw new Error('JWT_SECRET ortam değişkeni tanımlı değil.');
  }
  return secret;
};

export const signToken = (payload: AdminToken): string =>
  jwt.sign(payload, getSecret(), { expiresIn: '24h' });

/** İstekteki Bearer token'ı doğrular; geçersizse null döner. */
export const verifyToken = (req: Request): AdminToken | null => {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token) return null;
  try {
    return jwt.verify(token, getSecret()) as AdminToken;
  } catch {
    return null;
  }
};
