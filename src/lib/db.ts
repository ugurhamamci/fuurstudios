import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanına bağlanılamadı:', err.message);
  }
});

/** Panelden yönetilen ayarların varsayılan değerleri. */
export const DEFAULT_SETTINGS: Record<string, string> = {
  whatsappNumber: '905448508960',
  email: 'info@fuurstudio.com',
  site_meta_title: 'FUUR STUDIO - Dijital Ajans',
  site_meta_description:
    'Dijital dönüşüm ortağınız. Yazılım, AI ve tasarım çözümleri ile markanızı bir adım öne taşıyoruz.',
  instagram_url: 'https://www.instagram.com/fuurstudio/',
  linkedin_url: '',
  twitter_url: '',
  facebook_url: '',
  youtube_url: '',
  github_url: '',
};

db.serialize(() => {
  // Admins Tablosu
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // Projects Tablosu
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    category TEXT,
    image TEXT,
    meta_title TEXT,
    meta_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Blogs Tablosu
  db.run(`CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    date TEXT,
    image TEXT,
    meta_title TEXT,
    meta_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Settings Tablosu
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT
  )`);

  // Başarısız Giriş Denemeleri — kaba kuvvet saldırısını yavaşlatmak için.
  // Bellekte tutmak yerine tabloda: sunucu yeniden başlasa da sayaç kalıyor.
  db.run(`CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifier TEXT NOT NULL,
    attempted_at INTEGER NOT NULL
  )`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_login_attempts ON login_attempts (identifier, attempted_at)`);

  // Ekip Üyeleri Tablosu — her üyenin kendi sosyal medya hesapları var.
  db.run(`CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT,
    initials TEXT,
    accent_color TEXT,
    image TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    whatsapp TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Ekip tablosu boşsa siteyi boş bırakmamak için mevcut kartlarla doldur.
  // Panelden düzenlenebilir ve silinebilir.
  db.get(`SELECT COUNT(*) AS count FROM team_members`, (err, row: any) => {
    if (err || row?.count > 0) return;
    const seed: [string, string, string, string, string, string, string][] = [
      ['Uğur Yılmaz', 'Kurucu & Full-Stack Developer', 'Dijital çözümler ve AI entegrasyonları konusunda uzman.', 'UY', '#C8102E', 'https://www.instagram.com/fuurstudio/', ''],
      ['Elif Karaca', 'UI/UX Tasarımcı', 'Kullanıcı odaklı, estetik ve işlevsel arayüzler tasarlıyor.', 'EK', '#667eea', '', ''],
      ['Burak Demir', 'Backend Developer', 'Ölçeklenebilir ve güvenli sunucu mimarileri kuruyor.', 'BD', '#2dd4bf', '', ''],
      ['Selin Aydın', 'Dijital Pazarlama Uzmanı', 'Meta Ads ve sosyal medya stratejileri ile büyüme sağlıyor.', 'SA', '#f59e0b', '', ''],
    ];
    seed.forEach(([name, role, bio, initials, color, instagram, linkedin], i) => {
      db.run(
        `INSERT INTO team_members (name, role, bio, initials, accent_color, instagram_url, linkedin_url, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, role, bio, initials, color, instagram, linkedin, i]
      );
    });
  });

  // Varsayılan Admin — parola yalnızca ortam değişkeninden okunur, koda gömülmez.
  const seedUser = process.env.ADMIN_DEFAULT_USER;
  const seedPass = process.env.ADMIN_DEFAULT_PASSWORD;
  if (seedUser && seedPass) {
    db.get(`SELECT id FROM admins WHERE username = ?`, [seedUser], (err, row) => {
      if (!err && !row) {
        const hash = bcrypt.hashSync(seedPass, bcrypt.genSaltSync(10));
        db.run(`INSERT INTO admins (username, password) VALUES (?, ?)`, [seedUser, hash]);
      }
    });
  } else {
    db.get(`SELECT COUNT(*) AS count FROM admins`, (err, row: any) => {
      if (!err && row?.count === 0) {
        console.warn(
          'Yönetici tablosu boş. İlk yöneticiyi oluşturmak için ADMIN_DEFAULT_USER ve ADMIN_DEFAULT_PASSWORD ortam değişkenlerini tanımlayın.'
        );
      }
    });
  }

  // Varsayılan Ayarlar — var olan değerleri ezmez.
  Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
    db.run(`INSERT OR IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)`, [key, value]);
  });
});

export const query = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const run = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const get = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

/** Tüm ayarları anahtar/değer nesnesi olarak döner; eksik anahtarlar varsayılanla tamamlanır. */
export const getSettings = async (): Promise<Record<string, string>> => {
  const rows = await query(`SELECT setting_key, setting_value FROM settings`);
  const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
  rows.forEach((r: any) => {
    if (r.setting_value !== null) settings[r.setting_key] = r.setting_value;
  });
  return settings;
};

/**
 * Ayarı ekler ya da günceller. Düz UPDATE, satır henüz yoksa sessizce hiçbir
 * şey yapmadığı için yeni ayar anahtarları kaydedilmiyordu.
 */
export const upsertSetting = (key: string, value: string): Promise<any> =>
  run(
    `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
     ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value`,
    [key, value]
  );

export default db;
