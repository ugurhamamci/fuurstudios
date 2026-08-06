const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'fuur_secret_key_123';

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer Upload Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../assets/images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'upload-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

/* ================== AUTH API ================== */
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM admins WHERE username = ?`, [username], (err, admin) => {
    if (err) return res.status(500).json({ error: 'DB Hatası' });
    if (!admin) return res.status(401).json({ error: 'Kullanıcı bulunamadı' });

    if (bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET_KEY, { expiresIn: '24h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Hatalı şifre' });
    }
  });
});

/* ================== SETTINGS API ================== */
app.get('/api/settings', (req, res) => {
  db.all(`SELECT * FROM settings`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const settings = {};
    rows.forEach(r => settings[r.setting_key] = r.setting_value);
    res.json(settings);
  });
});

app.post('/api/settings', authenticateToken, (req, res) => {
  const settings = req.body;
  const stmt = db.prepare(`UPDATE settings SET setting_value = ? WHERE setting_key = ?`);
  
  for (const [key, value] of Object.entries(settings)) {
    stmt.run([value, key]);
  }
  stmt.finalize();
  res.json({ message: 'Ayarlar güncellendi' });
});

/* ================== PROJECTS API ================== */
app.get('/api/projects', (req, res) => {
  db.all(`SELECT * FROM projects ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/projects', authenticateToken, upload.single('image'), (req, res) => {
  const { title, description, category, meta_title, meta_description } = req.body;
  const image = req.file ? `assets/images/${req.file.filename}` : '';

  db.run(`INSERT INTO projects (title, description, category, image, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, category, image, meta_title, meta_description], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, image });
    });
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  db.run(`DELETE FROM projects WHERE id = ?`, req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Silindi' });
  });
});

/* ================== BLOGS API ================== */
app.get('/api/blogs', (req, res) => {
  db.all(`SELECT * FROM blogs ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/blogs', authenticateToken, upload.single('image'), (req, res) => {
  const { title, excerpt, content, category, date, meta_title, meta_description } = req.body;
  const image = req.file ? `assets/images/${req.file.filename}` : '';

  db.run(`INSERT INTO blogs (title, excerpt, content, category, date, image, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, excerpt, content, category, date, image, meta_title, meta_description], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, image });
    });
});

app.delete('/api/blogs/:id', authenticateToken, (req, res) => {
  db.run(`DELETE FROM blogs WHERE id = ?`, req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Silindi' });
  });
});

/* ================== PAGE ROUTES ================== */
app.get('/', (req, res) => {
  db.all(`SELECT * FROM settings`, [], (err, settingsRows) => {
    const settings = {};
    if (settingsRows) settingsRows.forEach(r => settings[r.setting_key] = r.setting_value);
    
    db.all(`SELECT * FROM projects ORDER BY id DESC`, [], (err, projects) => {
      db.all(`SELECT * FROM blogs ORDER BY id DESC`, [], (err, blogs) => {
        res.render('index', { settings, projects: projects || [], blogs: blogs || [] });
      });
    });
  });
});

app.get('/admin', (req, res) => {
  res.render('admin');
});

/* ================== STATIC FILES ================== */
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
