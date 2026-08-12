import type { Metadata } from 'next';

/**
 * Panel adresi gizli olsa da bir yere sızarsa arama motorlarına düşmesin.
 * robots.txt yalnızca /admin'i engelliyor; gizli adresi oraya yazmak onu
 * herkese duyurmak olurdu, bu yüzden koruma sayfa seviyesinde.
 */
export const metadata: Metadata = {
  title: 'Yönetim Paneli',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
