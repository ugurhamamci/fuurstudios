import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Panelin herkesin tahmin edebileceği /admin adresinde durmasını engeller.
 *
 * ADMIN_PATH tanımlıysa panel yalnızca o adresten açılır ve /admin 404 döner.
 * Tanımlı değilse /admin çalışmaya devam eder — böylece ortam değişkenini
 * eklemeyi unutmak kimseyi paneline kilitlemez.
 *
 * Not: Bu bir gizleme önlemi, kimlik doğrulama değil. Asıl koruma giriş
 * ekranındaki parola ve deneme sınırıdır.
 */
const rawAdminPath = process.env.ADMIN_PATH?.trim().replace(/^\/+|\/+$/g, '') || '';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!rawAdminPath) return NextResponse.next();

  const secret = `/${rawAdminPath}`;

  // Gizli adres -> panel. Yeniden yazma içeride kaldığı için tarayıcıdaki
  // adres değişmez ve /admin dışarıya sızmaz.
  if (pathname === secret || pathname.startsWith(`${secret}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(secret, '/admin') || '/admin';
    return NextResponse.rewrite(url);
  }

  // Doğrudan /admin denemesi: panelin varlığını sızdırmamak için sıradan bir
  // 404 gibi davranır.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/sayfa-bulunamadi';
    return NextResponse.rewrite(url, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // matcher sabit olmak zorunda (build sırasında statik analiz ediliyor), bu
  // yüzden gizli adres burada değil fonksiyon içinde kontrol ediliyor.
  // Statik dosyalar ve API uçları dışarıda bırakıldı.
  matcher: [
    '/((?!api|_next/static|_next/image|_next/data|assets|css|js|uploads|favicon.ico|icon.png|sitemap.xml|robots.txt).*)',
  ],
};
