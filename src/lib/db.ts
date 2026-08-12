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
