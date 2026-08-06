"use client";

import { useState, useEffect, FormEvent } from "react";
import "./admin.css";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [settings, setSettings] = useState<any>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  // Blog form state
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("teknoloji");
  const [blogDate, setBlogDate] = useState("");
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [blogMetaTitle, setBlogMetaTitle] = useState("");
  const [blogMetaDesc, setBlogMetaDesc] = useState("");

  // Project form state
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("web");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [projectMetaTitle, setProjectMetaTitle] = useState("");
  const [projectMetaDesc, setProjectMetaDesc] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (t) {
      setToken(t);
      loadData(t);
    }
  }, []);

  const loadData = async (t: string) => {
    try {
      const resSettings = await fetch("/api/settings", { headers: { Authorization: `Bearer ${t}` } });
      if (resSettings.ok) setSettings(await resSettings.json());

      const resProjects = await fetch("/api/projects");
      if (resProjects.ok) setProjects(await resProjects.json());

      const resBlogs = await fetch("/api/blogs");
      if (resBlogs.ok) setBlogs(await resBlogs.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("admin_token", data.token);
        setToken(data.token);
        loadData(data.token);
      } else {
        setLoginError(data.error || "Giriş başarısız");
      }
    } catch (err) {
      setLoginError("Sunucu hatası");
    }
  };

  const handleSettingsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings)
      });
      if (res.ok) alert("Ayarlar kaydedildi!");
    } catch (err) {
      alert("Hata");
    }
  };

  const startEditingProject = (p: any) => {
    setEditingProjectId(p.id);
    setProjectTitle(p.title || "");
    setProjectCategory(p.category || "web");
    setProjectDescription(p.description || "");
    setProjectMetaTitle(p.meta_title || "");
    setProjectMetaDesc(p.meta_description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditingProject = () => {
    setEditingProjectId(null);
    setProjectTitle("");
    setProjectCategory("web");
    setProjectDescription("");
    setProjectMetaTitle("");
    setProjectMetaDesc("");
    setProjectImage(null);
  };

  const handleProjectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", projectTitle);
    formData.append("category", projectCategory);
    formData.append("description", projectDescription);
    formData.append("meta_title", projectMetaTitle);
    formData.append("meta_description", projectMetaDesc);
    if (projectImage) formData.append("image", projectImage);

    try {
      const url = editingProjectId ? `/api/projects/${editingProjectId}` : "/api/projects";
      const method = editingProjectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert(editingProjectId ? "Proje Güncellendi!" : "Proje Eklendi!");
        cancelEditingProject();
        if (token) loadData(token);
      } else {
        alert("Hata oluştu");
      }
    } catch (err) {
      alert("Hata oluştu");
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        if (token) loadData(token);
      } else {
        alert("Silinemedi");
      }
    } catch (err) {
      alert("Hata");
    }
  };

  const handleBlogSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", blogTitle);
    formData.append("excerpt", blogExcerpt);
    formData.append("content", blogContent);
    formData.append("category", blogCategory);
    formData.append("date", blogDate);
    formData.append("meta_title", blogMetaTitle);
    formData.append("meta_description", blogMetaDesc);
    if (blogImage) formData.append("image", blogImage);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert("Blog Eklendi!");
        setBlogTitle("");
        setBlogExcerpt("");
        setBlogContent("");
        setBlogDate("");
        setBlogMetaTitle("");
        setBlogMetaDesc("");
        setBlogImage(null);
        if (token) loadData(token);
      } else {
        alert("Hata oluştu");
      }
    } catch (err) {
      alert("Hata oluştu");
    }
  };

  const deleteBlog = async (id: number) => {
    if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        if (token) loadData(token);
      } else {
        alert("Silinemedi");
      }
    } catch (err) {
      alert("Hata");
    }
  };

  if (!token) {
    return (
      <div className="admin-wrapper admin-login-fullscreen">
        <div className="glass-panel login-glass animate-fade-in">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
            <img src="/assets/logo-horizontal-white.png" alt="FUUR STUDIO" style={{ width: "220px", height: "auto", objectFit: "contain" }} />
          </div>
          <form onSubmit={handleLogin}>
            <div className="glass-form-group">
              <label className="glass-label">Kullanıcı Adı</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="glass-input" required placeholder="admin" />
            </div>
            <div className="glass-form-group">
              <label className="glass-label">Şifre</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="glass-input" required placeholder="••••••••" />
            </div>
            {loginError && <p style={{ color: '#ff4a4a', fontSize: '0.9rem', marginBottom: '1rem' }}>{loginError}</p>}
            <button type="submit" className="glass-btn">Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar-modern">
        <div className="sidebar-logo" style={{ padding: "0 1rem", marginBottom: "2.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src="/assets/logo-horizontal-white.png" alt="FUUR STUDIO" style={{ width: "160px", height: "auto", objectFit: "contain", maxWidth: "100%" }} />
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Gösterge Paneli
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path></svg>
            Genel Ayarlar
          </button>
          <button className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Portfolyo
          </button>
          <button className={`nav-item ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Bloglar
          </button>
        </nav>
        <button className="nav-item" style={{ marginTop: "auto", color: "#ff4a4a" }} onClick={() => { localStorage.removeItem("admin_token"); setToken(null); }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Çıkış Yap
        </button>
      </aside>

      <main className="admin-main-modern animate-fade-in">
        {activeTab === 'dashboard' && (
          <div>
            <div className="admin-header">
              <h1 className="admin-title">Hoş Geldiniz</h1>
              <p className="admin-subtitle">Sitenizin genel durumunu buradan takip edebilirsiniz.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
              <div className="glass-panel" style={{ textAlign: "center", padding: "2rem" }}>
                <h3 style={{ fontSize: "3rem", fontWeight: 800, color: "#C8102E", margin: 0 }}>{projects.length}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>Yayındaki Projeler</p>
              </div>
              <div className="glass-panel" style={{ textAlign: "center", padding: "2rem" }}>
                <h3 style={{ fontSize: "3rem", fontWeight: 800, color: "#C8102E", margin: 0 }}>{blogs.length}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>Yayındaki Bloglar</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className="admin-header">
              <h1 className="admin-title">Sistem Ayarları</h1>
              <p className="admin-subtitle">Sitenin genel SEO ve iletişim bilgilerini buradan yönetin.</p>
            </div>
            
            <div className="glass-panel" style={{ maxWidth: "800px" }}>
              <form onSubmit={handleSettingsSubmit}>
                <div className="glass-form-group">
                  <label className="glass-label">Site SEO Başlığı (Meta Title)</label>
                  <input type="text" className="glass-input" value={settings.site_meta_title || ''} onChange={e => setSettings({...settings, site_meta_title: e.target.value})} placeholder="FUUR STUDIO - Dijital Ajans" />
                </div>
                
                <div className="glass-form-group">
                  <label className="glass-label">Site SEO Açıklaması (Meta Description)</label>
                  <textarea className="glass-input" value={settings.site_meta_description || ''} onChange={e => setSettings({...settings, site_meta_description: e.target.value})} placeholder="Dijital dönüşüm ortağınız..."></textarea>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">WhatsApp Numarası</label>
                    <input type="text" className="glass-input" value={settings.whatsappNumber || ''} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">E-Posta Adresi</label>
                    <input type="email" className="glass-input" value={settings.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">Instagram Linki</label>
                    <input type="url" className="glass-input" placeholder="https://instagram.com/fuurstudio" value={settings.instagram_url || ''} onChange={e => setSettings({...settings, instagram_url: e.target.value})} />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">LinkedIn Linki</label>
                    <input type="url" className="glass-input" placeholder="https://linkedin.com/company/fuurstudio" value={settings.linkedin_url || ''} onChange={e => setSettings({...settings, linkedin_url: e.target.value})} />
                  </div>
                </div>
                
                <button type="submit" className="glass-btn" style={{ marginTop: "1rem" }}>Değişiklikleri Kaydet</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="admin-header">
              <h1 className="admin-title">Portfolyo Yönetimi</h1>
              <p className="admin-subtitle">Sitenizdeki projeleri modern ve SEO uyumlu bir şekilde ekleyin.</p>
            </div>
            
            <div className="glass-panel" style={{ marginBottom: "3rem" }}>
              <form onSubmit={handleProjectSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">Proje Adı</label>
                    <input type="text" className="glass-input" placeholder="Harika Web Sitesi" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} required />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Kategori</label>
                    <select className="glass-input glass-select" value={projectCategory} onChange={e => setProjectCategory(e.target.value)} required>
                      <option value="web">Web Sitesi</option>
                      <option value="ecommerce">E-Ticaret</option>
                      <option value="mobile">Mobil Uygulama</option>
                      <option value="ai">Yapay Zeka (AI)</option>
                    </select>
                  </div>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">Açıklama</label>
                  <textarea className="glass-input" placeholder="Proje hakkında kısaca bilgi..." value={projectDescription} onChange={e => setProjectDescription(e.target.value)} required></textarea>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">Proje Görseli</label>
                  <div className="file-upload-wrapper">
                    <input type="file" className="file-upload-input" accept="image/*" onChange={e => setProjectImage(e.target.files ? e.target.files[0] : null)} required />
                    <div className="file-upload-text">
                      <svg width="32" height="32" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      {projectImage ? projectImage.name : "Görsel Seçmek İçin Tıklayın veya Sürükleyin"}
                    </div>
                  </div>
                </div>
                
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#C8102E", marginTop: "1rem", marginBottom: "1.5rem" }}>SEO Ayarları (İsteğe Bağlı)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">Özel Meta Başlığı</label>
                    <input type="text" className="glass-input" placeholder="Google aramalarında çıkacak başlık" value={projectMetaTitle} onChange={e => setProjectMetaTitle(e.target.value)} />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Özel Meta Açıklaması</label>
                    <input type="text" className="glass-input" placeholder="Google aramalarında çıkacak açıklama" value={projectMetaDesc} onChange={e => setProjectMetaDesc(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="glass-btn">
                    {editingProjectId ? "Projeyi Güncelle" : "Projeyi Yayına Al"}
                  </button>
                  {editingProjectId && (
                    <button type="button" className="glass-btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }} onClick={cancelEditingProject}>
                      İptal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>Yayındaki Projeler</h2>
            <div className="project-list-modern">
              {projects.length === 0 ? <p style={{ color: "rgba(255,255,255,0.4)" }}>Henüz proje eklenmedi.</p> : null}
              {projects.map(p => (
                <div key={p.id} className="project-card-modern" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {p.image && (
                    <div style={{ width: "100%", height: "150px", borderRadius: "8px", overflow: "hidden" }}>
                      <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div>
                    <h4 className="project-card-title">{p.title}</h4>
                    <p className="project-card-cat">{p.category}</p>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>{p.description}</p>
                  </div>
                  <div className="project-card-actions" style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="glass-btn" style={{ flex: 1, padding: "0.5rem", fontSize: "0.9rem" }} onClick={() => startEditingProject(p)}>Düzenle</button>
                    <button className="glass-btn-danger" style={{ flex: 1, padding: "0.5rem", fontSize: "0.9rem" }} onClick={() => deleteProject(p.id)}>Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div>
            <div className="admin-header">
              <h1 className="admin-title">Blog Yönetimi</h1>
              <p className="admin-subtitle">Blog yazılarınızı buradan ekleyin ve düzenleyin.</p>
            </div>
            
            <div className="glass-panel" style={{ marginBottom: "3rem" }}>
              <form onSubmit={handleBlogSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">Blog Başlığı</label>
                    <input type="text" className="glass-input" placeholder="SEO Uyumlu Blog Başlığı" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} required />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Kategori</label>
                    <select className="glass-input glass-select" value={blogCategory} onChange={e => setBlogCategory(e.target.value)} required>
                      <option value="teknoloji">Teknoloji</option>
                      <option value="tasarim">Tasarım</option>
                      <option value="yapay-zeka">Yapay Zeka</option>
                      <option value="is-dunyasi">İş Dünyası</option>
                    </select>
                  </div>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">Kısa Özet (Excerpt)</label>
                  <textarea className="glass-input" placeholder="Blog listesinde görünecek kısa açıklama..." value={blogExcerpt} onChange={e => setBlogExcerpt(e.target.value)} required></textarea>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">İçerik (HTML veya Düz Metin)</label>
                  <textarea className="glass-input" placeholder="Blog içeriği..." value={blogContent} onChange={e => setBlogContent(e.target.value)} required style={{ minHeight: "150px" }}></textarea>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">Blog Görseli</label>
                    <div className="file-upload-wrapper">
                      <input type="file" className="file-upload-input" accept="image/*" onChange={e => setBlogImage(e.target.files ? e.target.files[0] : null)} required />
                      <div className="file-upload-text">
                        <svg width="32" height="32" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        {blogImage ? blogImage.name : "Görsel Seçmek İçin Tıklayın"}
                      </div>
                    </div>
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Tarih</label>
                    <input type="date" className="glass-input" value={blogDate} onChange={e => setBlogDate(e.target.value)} required />
                  </div>
                </div>
                
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#C8102E", marginTop: "1rem", marginBottom: "1.5rem" }}>SEO Ayarları (İsteğe Bağlı)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">Özel Meta Başlığı</label>
                    <input type="text" className="glass-input" placeholder="Google aramalarında çıkacak başlık" value={blogMetaTitle} onChange={e => setBlogMetaTitle(e.target.value)} />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Özel Meta Açıklaması</label>
                    <input type="text" className="glass-input" placeholder="Google aramalarında çıkacak açıklama" value={blogMetaDesc} onChange={e => setBlogMetaDesc(e.target.value)} />
                  </div>
                </div>

                <button type="submit" className="glass-btn" style={{ marginTop: "1rem" }}>Blog Yazısını Yayınla</button>
              </form>
            </div>

            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>Yayındaki Bloglar</h2>
            <div className="project-list-modern">
              {blogs.length === 0 ? <p style={{ color: "rgba(255,255,255,0.4)" }}>Henüz blog eklenmedi.</p> : null}
              {blogs.map(b => (
                <div key={b.id} className="project-card-modern">
                  <div>
                    <h4 className="project-card-title">{b.title}</h4>
                    <p className="project-card-cat">{b.category} - {b.date}</p>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>{b.excerpt}</p>
                  </div>
                  <div className="project-card-actions">
                    <button className="glass-btn-danger" onClick={() => deleteBlog(b.id)}>Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
