const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('admin_token');
  if (token) showDashboard(); else showLogin();

  // Login
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        errorMsg.style.display = 'none';
        showDashboard();
      } else {
        errorMsg.textContent = data.error; errorMsg.style.display = 'block';
      }
    } catch (err) {
      errorMsg.textContent = 'Sunucuya bağlanılamadı.'; errorMsg.style.display = 'block';
    }
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('admin_token');
    showLogin();
  });

  // Tabs
  const tabs = document.querySelectorAll('.sidebar-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      e.target.classList.add('active');
      document.getElementById(`tab-${e.target.dataset.tab}`).classList.remove('hidden');
    });
  });

  // Forms
  document.getElementById('settings-form').addEventListener('submit', handleSettingsSubmit);
  document.getElementById('add-project-form').addEventListener('submit', (e) => handleUploadSubmit(e, 'projects'));
  document.getElementById('add-blog-form').addEventListener('submit', (e) => handleUploadSubmit(e, 'blogs'));
});

function showLogin() {
  document.getElementById('login-section').classList.remove('hidden');
  document.getElementById('dashboard-section').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('dashboard-section').classList.remove('hidden');
  loadSettings();
  loadItems('projects');
  loadItems('blogs');
}

async function loadSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`);
    const data = await res.json();
    if (data.whatsappNumber) document.getElementById('setting-whatsapp').value = data.whatsappNumber;
    if (data.email) document.getElementById('setting-email').value = data.email;
    if (data.site_meta_title) document.getElementById('setting-meta-title').value = data.site_meta_title;
    if (data.site_meta_description) document.getElementById('setting-meta-desc').value = data.site_meta_description;
  } catch (e) { console.error(e); }
}

async function handleSettingsSubmit(e) {
  e.preventDefault();
  const token = localStorage.getItem('admin_token');
  const payload = {
    whatsappNumber: document.getElementById('setting-whatsapp').value,
    email: document.getElementById('setting-email').value,
    site_meta_title: document.getElementById('setting-meta-title').value,
    site_meta_description: document.getElementById('setting-meta-desc').value
  };

  try {
    const res = await fetch(`${API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) alert('Ayarlar kaydedildi!');
    else alert('Hata oluştu');
  } catch (err) { alert('Sunucu hatası'); }
}

async function loadItems(type) {
  try {
    const res = await fetch(`${API_URL}/${type}`);
    const data = await res.json();
    const list = document.getElementById(`${type}-list`);
    list.innerHTML = data.length === 0 ? '<p>İçerik yok.</p>' : '';
    
    data.forEach(item => {
      const div = document.createElement('div');
      div.className = 'admin-list-item';
      div.innerHTML = `
        <div><h4>${item.title}</h4><p>${item.category || item.date || ''}</p></div>
        <div class="admin-list-actions"><button class="btn btn--ghost" onclick="deleteItem('${type}', ${item.id})" style="color:var(--brand-red);">Sil</button></div>
      `;
      list.appendChild(div);
    });
  } catch (e) {}
}

async function handleUploadSubmit(e, type) {
  e.preventDefault();
  const token = localStorage.getItem('admin_token');
  const formData = new FormData();

  if (type === 'projects') {
    formData.append('title', document.getElementById('project-title').value);
    formData.append('category', document.getElementById('project-category').value);
    formData.append('description', document.getElementById('project-description').value);
    formData.append('meta_title', document.getElementById('project-meta-title').value);
    formData.append('meta_description', document.getElementById('project-meta-desc').value);
    formData.append('image', document.getElementById('project-image').files[0]);
  } else {
    formData.append('title', document.getElementById('blog-title').value);
    formData.append('category', document.getElementById('blog-category').value);
    formData.append('date', document.getElementById('blog-date').value);
    formData.append('excerpt', document.getElementById('blog-excerpt').value);
    formData.append('meta_title', document.getElementById('blog-meta-title').value);
    formData.append('meta_description', document.getElementById('blog-meta-desc').value);
    formData.append('image', document.getElementById('blog-image').files[0]);
  }

  try {
    const res = await fetch(`${API_URL}/${type}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (res.ok) { e.target.reset(); alert('Eklendi!'); loadItems(type); }
    else alert('Hata oluştu');
  } catch (err) { alert('Hata oluştu'); }
}

async function deleteItem(type, id) {
  if (!confirm('Silmek istediğine emin misin?')) return;
  const token = localStorage.getItem('admin_token');
  try {
    await fetch(`${API_URL}/${type}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    loadItems(type);
  } catch (e) { alert('Hata'); }
}
