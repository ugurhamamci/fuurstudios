import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanına bağlanılamadı:', err.message);
  }
});

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

  // Varsayılan Admin
  db.get(`SELECT id FROM admins WHERE username = ?`, ['ugurhamamci'], (err, row) => {
    if (!row) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('Ugur145360*', salt);
      db.run(`INSERT INTO admins (username, password) VALUES (?, ?)`, ['ugurhamamci', hash]);
    }
  });

  // Varsayılan Ayarlar
  const defaultSettings = [
    ['whatsappNumber', '905448508960'],
    ['email', 'info@fuurstudio.com'],
    ['site_meta_title', 'FUUR STUDIO - Dijital Ajans'],
    ['site_meta_description', 'Dijital dönüşüm ortağınız. Yazılım, AI ve tasarım çözümleri ile markanızı bir adım öne taşıyoruz.']
  ];

  defaultSettings.forEach(([key, value]) => {
    db.get(`SELECT setting_key FROM settings WHERE setting_key = ?`, [key], (err, row) => {
      if (!row) db.run(`INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)`, [key, value]);
    });
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

export default db;
