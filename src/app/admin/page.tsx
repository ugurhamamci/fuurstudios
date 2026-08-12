"use client";

import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./admin.css";

type Social = { key: string; label: string; placeholder: string };

const SOCIAL_FIELDS: Social[] = [
  { key: "instagram_url", label: "Instagram", placeholder: "https://instagram.com/fuurstudio" },
  { key: "linkedin_url", label: "LinkedIn", placeholder: "https://linkedin.com/company/fuurstudio" },
  { key: "twitter_url", label: "X (Twitter)", placeholder: "https://x.com/fuurstudio" },
  { key: "facebook_url", label: "Facebook", placeholder: "https://facebook.com/fuurstudio" },
  { key: "youtube_url", label: "YouTube", placeholder: "https://youtube.com/@fuurstudio" },
  { key: "github_url", label: "GitHub", placeholder: "https://github.com/fuurstudio" },
];

const PROJECT_CATEGORIES = [
  { value: "web", label: "Web Sitesi" },
  { value: "ecommerce", label: "E-Ticaret" },
  { value: "mobile", label: "Mobil Uygulama" },
  { value: "ai", label: "Yapay Zeka (AI)" },
];

const BLOG_CATEGORIES = [
  { value: "teknoloji", label: "Teknoloji" },
  { value: "tasarim", label: "Tasarım" },
  { value: "yapay-zeka", label: "Yapay Zeka" },
  { value: "is-dunyasi", label: "İş Dünyası" },
];

/** Ekip üyelerinin kişisel hesapları — şirket hesaplarından ayrı. */
const TEAM_SOCIAL_FIELDS: Social[] = [
  { key: "linkedin_url", label: "LinkedIn", placeholder: "https://linkedin.com/in/kullanici" },
  { key: "instagram_url", label: "Instagram", placeholder: "https://instagram.com/kullanici" },
  { key: "github_url", label: "GitHub", placeholder: "https://github.com/kullanici" },
  { key: "twitter_url", label: "X (Twitter)", placeholder: "https://x.com/kullanici" },
];

const emptyTeamForm = {
  name: "",
  role: "",
  bio: "",
  initials: "",
  accent_color: "#C8102E",
  whatsapp: "",
  sort_order: "0",
  linkedin_url: "",
  instagram_url: "",
  github_url: "",
  twitter_url: "",
};

const emptyProjectForm = {
  title: "",
  category: "web",
  description: "",
  metaTitle: "",
  metaDesc: "",
};

const emptyBlogForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "teknoloji",
  date: "",
  metaTitle: "",
  metaDesc: "",
};

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lightMode, setLightMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);

  // Ekip formu
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [teamForm, setTeamForm] = useState({ ...emptyTeamForm });
  const [teamImage, setTeamImage] = useState<File | null>(null);
  const [teamCurrentImage, setTeamCurrentImage] = useState<string>("");

  const [confirmState, setConfirmState] = useState<{ message: string; onConfirm: () => void } | null>(null);

  // Yönetici formu
  const [editingAdminId, setEditingAdminId] = useState<number | null>(null);
  const [newAdminUser, setNewAdminUser] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");

  // Blog formu
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [blogForm, setBlogForm] = useState({ ...emptyBlogForm });
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [blogCurrentImage, setBlogCurrentImage] = useState<string>("");

  // Proje formu
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState({ ...emptyProjectForm });
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [projectCurrentImage, setProjectCurrentImage] = useState<string>("");

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setProjects([]);
    setBlogs([]);
    setAdmins([]);
    setTeam([]);
    setSettings({});
  }, []);

  /** Yetkisiz yanıtta oturumu kapatır; böylece süresi dolmuş token'la boş panelde kalınmaz. */
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}, activeToken?: string) => {
      const bearer = activeToken ?? token;
      const res = await fetch(url, {
        ...options,
        headers: { ...(options.headers || {}), Authorization: `Bearer ${bearer}` },
      });
      if (res.status === 401) {
        logout();
        toast.error("Oturumunuzun süresi doldu, lütfen tekrar giriş yapın.");
        throw new Error("unauthorized");
      }
      return res;
    },
    [token, logout]
  );

  const loadData = useCallback(
    async (activeToken: string) => {
      setLoading(true);
      try {
        const [resSettings, resProjects, resBlogs, resAdmins, resTeam] = await Promise.all([
          authFetch("/api/settings", {}, activeToken),
          fetch("/api/projects"),
          fetch("/api/blogs"),
          authFetch("/api/admins", {}, activeToken),
          fetch("/api/team"),
        ]);

        if (resSettings.ok) setSettings(await resSettings.json());
        if (resProjects.ok) setProjects(await resProjects.json());
        if (resBlogs.ok) setBlogs(await resBlogs.json());
        if (resAdmins.ok) setAdmins(await resAdmins.json());
        if (resTeam.ok) setTeam(await resTeam.json());
      } catch (e: any) {
        if (e?.message !== "unauthorized") toast.error("Veriler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (t) {
      setToken(t);
      loadData(t);
    }
    if (localStorage.getItem("admin_theme") === "light") setLightMode(true);
    // Yalnızca ilk açılışta çalışmalı.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => {
    const newMode = !lightMode;
    setLightMode(newMode);
    localStorage.setItem("admin_theme", newMode ? "light" : "dark");
  };

  const askConfirm = (message: string, onConfirm: () => void) => setConfirmState({ message, onConfirm });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("admin_token", data.token);
        setToken(data.token);
        setUsername("");
        setPassword("");
        loadData(data.token);
      } else {
        setLoginError(data.error || "Giriş başarısız");
      }
    } catch {
      setLoginError("Sunucuya ulaşılamadı");
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.settings) setSettings(data.settings);
        toast.success("Ayarlar kaydedildi.");
      } else {
        toast.error(data.error || "Ayarlar kaydedilemedi.");
      }
    } catch (e: any) {
      if (e?.message !== "unauthorized") toast.error("Ayarlar kaydedilemedi.");
    }
  };

  // ---- Projeler ----

  const startEditingProject = (p: any) => {
    setEditingProjectId(p.id);
    setProjectForm({
      title: p.title || "",
      category: p.category || "web",
      description: p.description || "",
      metaTitle: p.meta_title || "",
      metaDesc: p.meta_description || "",
    });
    setProjectImage(null);
    setProjectCurrentImage(p.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditingProject = () => {
    setEditingProjectId(null);
    setProjectForm({ ...emptyProjectForm });
    setProjectImage(null);
    setProjectCurrentImage("");
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProjectId && !projectImage) {
      toast.error("Yeni proje için görsel seçmelisiniz.");
      return;
    }

    const formData = new FormData();
    formData.append("title", projectForm.title);
    formData.append("category", projectForm.category);
    formData.append("description", projectForm.description);
    formData.append("meta_title", projectForm.metaTitle);
    formData.append("meta_description", projectForm.metaDesc);
    if (projectImage) formData.append("image", projectImage);

    try {
      const res = await authFetch(editingProjectId ? `/api/projects/${editingProjectId}` : "/api/projects", {
        method: editingProjectId ? "PUT" : "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingProjectId ? "Proje güncellendi." : "Proje eklendi.");
        cancelEditingProject();
        if (token) loadData(token);
      } else {
        toast.error(data.error || "Proje kaydedilemedi.");
      }
    } catch (e: any) {
      if (e?.message !== "unauthorized") toast.error("Proje kaydedilemedi.");
    }
  };

  const deleteProject = (id: number) =>
    askConfirm("Bu projeyi silmek istediğinize emin misiniz?", async () => {
      try {
        const res = await authFetch(`/api/projects/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
          toast.success("Proje silindi.");
          if (editingProjectId === id) cancelEditingProject();
          if (token) loadData(token);
        } else {
          toast.error(data.error || "Proje silinemedi.");
        }
      } catch (e: any) {
        if (e?.message !== "unauthorized") toast.error("Proje silinemedi.");
      }
    });

  // ---- Bloglar ----

  const startEditingBlog = (b: any) => {
    setEditingBlogId(b.id);
    setBlogForm({
      title: b.title || "",
      excerpt: b.excerpt || "",
      content: b.content || "",
      category: b.category || "teknoloji",
      date: b.date || "",
      metaTitle: b.meta_title || "",
      metaDesc: b.meta_description || "",
    });
    setBlogImage(null);
    setBlogCurrentImage(b.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditingBlog = () => {
    setEditingBlogId(null);
    setBlogForm({ ...emptyBlogForm });
    setBlogImage(null);
    setBlogCurrentImage("");
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlogId && !blogImage) {
      toast.error("Yeni blog yazısı için görsel seçmelisiniz.");
      return;
    }

    const formData = new FormData();
    formData.append("title", blogForm.title);
    formData.append("excerpt", blogForm.excerpt);
    formData.append("content", blogForm.content);
    formData.append("category", blogForm.category);
    formData.append("date", blogForm.date);
    formData.append("meta_title", blogForm.metaTitle);
    formData.append("meta_description", blogForm.metaDesc);
    if (blogImage) formData.append("image", blogImage);

    try {
      const res = await authFetch(editingBlogId ? `/api/blogs/${editingBlogId}` : "/api/blogs", {
        method: editingBlogId ? "PUT" : "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingBlogId ? "Blog güncellendi." : "Blog eklendi.");
        cancelEditingBlog();
        if (token) loadData(token);
      } else {
        toast.error(data.error || "Blog kaydedilemedi.");
      }
    } catch (e: any) {
      if (e?.message !== "unauthorized") toast.error("Blog kaydedilemedi.");
    }
  };

  const deleteBlog = (id: number) =>
    askConfirm("Bu blog yazısını silmek istediğinize emin misiniz?", async () => {
      try {
        const res = await authFetch(`/api/blogs/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
          toast.success("Blog silindi.");
          if (editingBlogId === id) cancelEditingBlog();
          if (token) loadData(token);
        } else {
          toast.error(data.error || "Blog silinemedi.");
        }
      } catch (e: any) {
        if (e?.message !== "unauthorized") toast.error("Blog silinemedi.");
      }
    });

  // ---- Ekip ----

  const startEditingTeam = (m: any) => {
    setEditingTeamId(m.id);
    setTeamForm({
      name: m.name || "",
      role: m.role || "",
      bio: m.bio || "",
      initials: m.initials || "",
      accent_color: m.accent_color || "#C8102E",
      whatsapp: m.whatsapp || "",
      sort_order: String(m.sort_order ?? 0),
      linkedin_url: m.linkedin_url || "",
      instagram_url: m.instagram_url || "",
      github_url: m.github_url || "",
      twitter_url: m.twitter_url || "",
    });
    setTeamImage(null);
    setTeamCurrentImage(m.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditingTeam = () => {
    setEditingTeamId(null);
    setTeamForm({ ...emptyTeamForm });
    setTeamImage(null);
    setTeamCurrentImage("");
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(teamForm).forEach(([key, value]) => formData.append(key, value));
    if (teamImage) formData.append("image", teamImage);

    try {
      const res = await authFetch(editingTeamId ? `/api/team/${editingTeamId}` : "/api/team", {
        method: editingTeamId ? "PUT" : "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingTeamId ? "Ekip üyesi güncellendi." : "Ekip üyesi eklendi.");
        cancelEditingTeam();
        if (token) loadData(token);
      } else {
        toast.error(data.error || "Kaydedilemedi.");
      }
    } catch (e: any) {
      if (e?.message !== "unauthorized") toast.error("Kaydedilemedi.");
    }
  };

  const deleteTeamMember = (id: number, name: string) =>
    askConfirm(`"${name}" adlı ekip üyesini silmek istediğinize emin misiniz?`, async () => {
      try {
        const res = await authFetch(`/api/team/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
          toast.success("Ekip üyesi silindi.");
          if (editingTeamId === id) cancelEditingTeam();
          if (token) loadData(token);
        } else {
          toast.error(data.error || "Silinemedi.");
        }
      } catch (e: any) {
        if (e?.message !== "unauthorized") toast.error("Silinemedi.");
      }
    });

  // ---- Yöneticiler ----

  const startEditingAdmin = (admin: any) => {
    setEditingAdminId(admin.id);
    setNewAdminUser(admin.username);
    setNewAdminPass("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditingAdmin = () => {
    setEditingAdminId(null);
    setNewAdminUser("");
    setNewAdminPass("");
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch(editingAdminId ? `/api/admins/${editingAdminId}` : "/api/admins", {
        method: editingAdminId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newAdminUser, password: newAdminPass }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingAdminId ? "Yönetici güncellendi." : "Yönetici eklendi.");
        cancelEditingAdmin();
        if (token) loadData(token);
      } else {
        toast.error(data.error || "İşlem tamamlanamadı.");
      }
    } catch (e: any) {
      if (e?.message !== "unauthorized") toast.error("İşlem tamamlanamadı.");
    }
  };

  const deleteAdmin = (id: number) =>
    askConfirm("Bu yöneticiyi silmek istediğinize emin misiniz?", async () => {
      try {
        const res = await authFetch(`/api/admins/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
          toast.success("Yönetici silindi.");
          if (editingAdminId === id) cancelEditingAdmin();
          if (token) loadData(token);
        } else {
          toast.error(data.error || "Yönetici silinemedi.");
        }
      } catch (e: any) {
        if (e?.message !== "unauthorized") toast.error("Yönetici silinemedi.");
      }
    });

  if (!token) {
    return (
      <div className="admin-wrapper admin-login-fullscreen">
        <div className="glass-panel login-glass animate-fade-in">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
            <img
              src="/assets/logo-horizontal-white.png"
              alt="FUUR STUDIO"
              style={{ width: "220px", height: "auto", objectFit: "contain" }}
            />
          </div>
          <form onSubmit={handleLogin}>
            <div className="glass-form-group">
              <label className="glass-label" htmlFor="login-user">Kullanıcı Adı</label>
              <input
                id="login-user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input"
                required
                autoComplete="username"
                placeholder="admin"
              />
            </div>
            <div className="glass-form-group">
              <label className="glass-label" htmlFor="login-pass">Şifre</label>
              <input
                id="login-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>
            {loginError && (
              <p style={{ color: "#ff4a4a", fontSize: "0.9rem", marginBottom: "1rem" }}>{loginError}</p>
            )}
            <button type="submit" className="glass-btn">Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-wrapper ${lightMode ? "light-mode" : ""}`}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-color)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--border-light)",
          },
        }}
      />

      {confirmState && (
        <div
          className="confirm-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmState(null)}
        >
          <div className="glass-panel confirm-box" onClick={(e) => e.stopPropagation()}>
            <p className="confirm-message">{confirmState.message}</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button className="glass-btn glass-btn-outline" onClick={() => setConfirmState(null)}>
                Vazgeç
              </button>
              <button
                className="glass-btn-danger"
                onClick={() => {
                  const action = confirmState.onConfirm;
                  setConfirmState(null);
                  action();
                }}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="admin-sidebar-modern">
        <div
          className="sidebar-logo"
          style={{
            padding: "0 1rem",
            marginBottom: "2.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={lightMode ? "/assets/logo-horizontal.png" : "/assets/logo-horizontal-white.png"}
            alt="FUUR STUDIO"
            style={{ width: "160px", height: "auto", objectFit: "contain", maxWidth: "100%" }}
          />
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Gösterge Paneli
          </button>
          <button
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path></svg>
            Genel Ayarlar
          </button>
          <button
            className={`nav-item ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Portfolyo
          </button>
          <button
            className={`nav-item ${activeTab === "blogs" ? "active" : ""}`}
            onClick={() => setActiveTab("blogs")}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Bloglar
          </button>
          <button
            className={`nav-item ${activeTab === "team" ? "active" : ""}`}
            onClick={() => setActiveTab("team")}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
            Ekip
          </button>
          <button
            className={`nav-item ${activeTab === "admins" ? "active" : ""}`}
            onClick={() => setActiveTab("admins")}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Yöneticiler
          </button>
        </nav>
        <div
          className="sidebar-actions"
          style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <button className="nav-item" onClick={toggleTheme}>
            {lightMode ? (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>{" "}
                Koyu Tema
              </>
            ) : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>{" "}
                Açık Tema
              </>
            )}
          </button>
          <button className="nav-item" style={{ color: "var(--danger-color)" }} onClick={logout}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="admin-main-modern animate-fade-in">
        {activeTab === "dashboard" && (
          <div>
            <div className="admin-header">
              <h1 className="admin-title">Hoş Geldiniz</h1>
              <p className="admin-subtitle">Sitenizin genel durumunu buradan takip edebilirsiniz.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
              <div className="glass-panel" style={{ textAlign: "center", padding: "2rem" }}>
                <h3 style={{ fontSize: "3rem", fontWeight: 800, color: "#C8102E", margin: 0 }}>{projects.length}</h3>
                <p style={{ color: "var(--muted-color)", marginTop: "0.5rem" }}>Yayındaki Projeler</p>
              </div>
              <div className="glass-panel" style={{ textAlign: "center", padding: "2rem" }}>
                <h3 style={{ fontSize: "3rem", fontWeight: 800, color: "#C8102E", margin: 0 }}>{blogs.length}</h3>
                <p style={{ color: "var(--muted-color)", marginTop: "0.5rem" }}>Yayındaki Bloglar</p>
              </div>
              <div className="glass-panel" style={{ textAlign: "center", padding: "2rem" }}>
                <h3 style={{ fontSize: "3rem", fontWeight: 800, color: "#C8102E", margin: 0 }}>{admins.length}</h3>
                <p style={{ color: "var(--muted-color)", marginTop: "0.5rem" }}>Kayıtlı Yöneticiler</p>
              </div>
            </div>
            {loading && <p style={{ color: "var(--muted-color)", marginTop: "1.5rem" }}>Veriler yükleniyor…</p>}
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <div className="admin-header">
              <h1 className="admin-title">Sistem Ayarları</h1>
              <p className="admin-subtitle">Sitenin SEO, iletişim ve sosyal medya bilgilerini buradan yönetin.</p>
            </div>

            <div className="glass-panel" style={{ maxWidth: "800px" }}>
              <form onSubmit={handleSettingsSubmit}>
                <div className="glass-form-group">
                  <label className="glass-label">Site SEO Başlığı (Meta Title)</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={settings.site_meta_title || ""}
                    onChange={(e) => setSettings({ ...settings, site_meta_title: e.target.value })}
                    placeholder="FUUR STUDIO - Dijital Ajans"
                  />
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">Site SEO Açıklaması (Meta Description)</label>
                  <textarea
                    className="glass-input"
                    value={settings.site_meta_description || ""}
                    onChange={(e) => setSettings({ ...settings, site_meta_description: e.target.value })}
                    placeholder="Dijital dönüşüm ortağınız…"
                  ></textarea>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">WhatsApp Numarası</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={settings.whatsappNumber || ""}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="905448508960"
                    />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">E-Posta Adresi</label>
                    <input
                      type="email"
                      className="glass-input"
                      value={settings.email || ""}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      placeholder="info@fuurstudio.com"
                    />
                  </div>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#C8102E", marginTop: "1rem", marginBottom: "0.5rem" }}>
                  Sosyal Medya Hesapları
                </h3>
                <p style={{ color: "var(--muted-color)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  Boş bıraktığınız hesaplar sitenin altbilgisinde ve iletişim bölümünde gösterilmez.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {SOCIAL_FIELDS.map((field) => (
                    <div className="glass-form-group" key={field.key}>
                      <label className="glass-label">{field.label}</label>
                      <input
                        type="url"
                        className="glass-input"
                        placeholder={field.placeholder}
                        value={settings[field.key] || ""}
                        onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                <button type="submit" className="glass-btn" style={{ marginTop: "1rem" }}>
                  Değişiklikleri Kaydet
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div>
            <div className="admin-header">
              <h1 className="admin-title">Portfolyo Yönetimi</h1>
              <p className="admin-subtitle">Sitenizdeki projeleri modern ve SEO uyumlu bir şekilde yönetin.</p>
            </div>

            <div className="glass-panel" style={{ marginBottom: "3rem" }}>
              <form onSubmit={handleProjectSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">Proje Adı</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Harika Web Sitesi"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Kategori</label>
                    <select
                      className="glass-input glass-select"
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      required
                    >
                      {PROJECT_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">Açıklama</label>
                  <textarea
                    className="glass-input"
                    placeholder="Proje hakkında kısaca bilgi…"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">
                    Proje Görseli {editingProjectId && "(değiştirmeyecekseniz boş bırakın)"}
                  </label>
                  {editingProjectId && projectCurrentImage && (
                    <img src={projectCurrentImage} alt="Mevcut görsel" className="form-image-preview" />
                  )}
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      className="file-upload-input"
                      accept="image/*"
                      onChange={(e) => setProjectImage(e.target.files?.[0] || null)}
                    />
                    <div className="file-upload-text">
                      <svg width="32" height="32" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      {projectImage ? projectImage.name : "Görsel Seçmek İçin Tıklayın veya Sürükleyin"}
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#C8102E", marginTop: "1rem", marginBottom: "1.5rem" }}>
                  SEO Ayarları (İsteğe Bağlı)
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">Özel Meta Başlığı</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Google aramalarında çıkacak başlık"
                      value={projectForm.metaTitle}
                      onChange={(e) => setProjectForm({ ...projectForm, metaTitle: e.target.value })}
                    />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Özel Meta Açıklaması</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Google aramalarında çıkacak açıklama"
                      value={projectForm.metaDesc}
                      onChange={(e) => setProjectForm({ ...projectForm, metaDesc: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="glass-btn">
                    {editingProjectId ? "Projeyi Güncelle" : "Projeyi Yayına Al"}
                  </button>
                  {editingProjectId && (
                    <button type="button" className="glass-btn glass-btn-outline" onClick={cancelEditingProject}>
                      İptal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>Yayındaki Projeler</h2>
            <div className="project-list-modern">
              {projects.length === 0 && (
                <p style={{ color: "var(--muted-color-light)" }}>Henüz proje eklenmedi.</p>
              )}
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="project-card-modern"
                  style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                  {p.image && (
                    <div style={{ width: "100%", height: "150px", borderRadius: "8px", overflow: "hidden" }}>
                      <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div>
                    <h4 className="project-card-title">{p.title}</h4>
                    <p className="project-card-cat">
                      {PROJECT_CATEGORIES.find((c) => c.value === p.category)?.label || p.category}
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "var(--muted-color)", marginBottom: "1.5rem" }}>
                      {p.description}
                    </p>
                  </div>
                  <div className="project-card-actions" style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="glass-btn"
                      style={{ flex: 1, padding: "0.5rem", fontSize: "0.9rem" }}
                      onClick={() => startEditingProject(p)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="glass-btn-danger"
                      style={{ flex: 1, padding: "0.5rem", fontSize: "0.9rem" }}
                      onClick={() => deleteProject(p.id)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "blogs" && (
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
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="SEO Uyumlu Blog Başlığı"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Kategori</label>
                    <select
                      className="glass-input glass-select"
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      required
                    >
                      {BLOG_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">Kısa Özet (Excerpt)</label>
                  <textarea
                    className="glass-input"
                    placeholder="Blog listesinde görünecek kısa açıklama…"
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">İçerik (HTML veya Düz Metin)</label>
                  <textarea
                    className="glass-input"
                    placeholder="Blog içeriği…"
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    required
                    style={{ minHeight: "150px" }}
                  ></textarea>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">
                      Blog Görseli {editingBlogId && "(değiştirmeyecekseniz boş bırakın)"}
                    </label>
                    {editingBlogId && blogCurrentImage && (
                      <img src={blogCurrentImage} alt="Mevcut görsel" className="form-image-preview" />
                    )}
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        className="file-upload-input"
                        accept="image/*"
                        onChange={(e) => setBlogImage(e.target.files?.[0] || null)}
                      />
                      <div className="file-upload-text">
                        <svg width="32" height="32" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        {blogImage ? blogImage.name : "Görsel Seçmek İçin Tıklayın"}
                      </div>
                    </div>
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Tarih</label>
                    <input
                      type="date"
                      className="glass-input"
                      value={blogForm.date}
                      onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#C8102E", marginTop: "1rem", marginBottom: "1.5rem" }}>
                  SEO Ayarları (İsteğe Bağlı)
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">Özel Meta Başlığı</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Google aramalarında çıkacak başlık"
                      value={blogForm.metaTitle}
                      onChange={(e) => setBlogForm({ ...blogForm, metaTitle: e.target.value })}
                    />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Özel Meta Açıklaması</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Google aramalarında çıkacak açıklama"
                      value={blogForm.metaDesc}
                      onChange={(e) => setBlogForm({ ...blogForm, metaDesc: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="glass-btn">
                    {editingBlogId ? "Blog Yazısını Güncelle" : "Blog Yazısını Yayınla"}
                  </button>
                  {editingBlogId && (
                    <button type="button" className="glass-btn glass-btn-outline" onClick={cancelEditingBlog}>
                      İptal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>Yayındaki Bloglar</h2>
            <div className="project-list-modern">
              {blogs.length === 0 && (
                <p style={{ color: "var(--muted-color-light)" }}>Henüz blog eklenmedi.</p>
              )}
              {blogs.map((b) => (
                <div key={b.id} className="project-card-modern">
                  <div>
                    <h4 className="project-card-title">{b.title}</h4>
                    <p className="project-card-cat">
                      {BLOG_CATEGORIES.find((c) => c.value === b.category)?.label || b.category}
                      {b.date ? ` — ${b.date}` : ""}
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "var(--muted-color)", marginBottom: "1.5rem" }}>
                      {b.excerpt}
                    </p>
                  </div>
                  <div className="project-card-actions" style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="glass-btn"
                      style={{ flex: 1, padding: "0.5rem", fontSize: "0.9rem" }}
                      onClick={() => startEditingBlog(b)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="glass-btn-danger"
                      style={{ flex: 1, padding: "0.5rem", fontSize: "0.9rem" }}
                      onClick={() => deleteBlog(b.id)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div>
            <div className="admin-header">
              <h1 className="admin-title">Ekip Yönetimi</h1>
              <p className="admin-subtitle">
                Ana sayfadaki Ekibimiz bölümünü ve her üyenin kendi sosyal medya hesaplarını buradan yönetin.
              </p>
            </div>

            <div className="glass-panel" style={{ marginBottom: "3rem" }}>
              <form onSubmit={handleTeamSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">İsim Soyisim</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Uğur Hamamcı"
                      value={teamForm.name}
                      onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Ünvan</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Kurucu Ortak"
                      value={teamForm.role}
                      onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    />
                  </div>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">Kısa Tanıtım</label>
                  <textarea
                    className="glass-input"
                    placeholder="Uzmanlık alanınızı bir cümleyle anlatın…"
                    value={teamForm.bio}
                    onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  ></textarea>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
                  <div className="glass-form-group">
                    <label className="glass-label">Baş Harfler</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Boş bırakılırsa isimden üretilir"
                      maxLength={3}
                      value={teamForm.initials}
                      onChange={(e) => setTeamForm({ ...teamForm, initials: e.target.value })}
                    />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Avatar Rengi</label>
                    <input
                      type="color"
                      className="glass-input"
                      style={{ height: "48px", padding: "0.25rem" }}
                      value={teamForm.accent_color}
                      onChange={(e) => setTeamForm({ ...teamForm, accent_color: e.target.value })}
                    />
                  </div>
                  <div className="glass-form-group">
                    <label className="glass-label">Sıra</label>
                    <input
                      type="number"
                      className="glass-input"
                      min={0}
                      value={teamForm.sort_order}
                      onChange={(e) => setTeamForm({ ...teamForm, sort_order: e.target.value })}
                    />
                  </div>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">
                    Fotoğraf (isteğe bağlı{editingTeamId ? ", değiştirmeyecekseniz boş bırakın" : ""})
                  </label>
                  {editingTeamId && teamCurrentImage && (
                    <img src={teamCurrentImage} alt="Mevcut fotoğraf" className="form-image-preview" />
                  )}
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      className="file-upload-input"
                      accept="image/*"
                      onChange={(e) => setTeamImage(e.target.files?.[0] || null)}
                    />
                    <div className="file-upload-text">
                      <svg width="32" height="32" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      {teamImage ? teamImage.name : "Fotoğraf yüklemezseniz baş harfler gösterilir"}
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#C8102E", marginTop: "1rem", marginBottom: "0.5rem" }}>
                  Kişisel Sosyal Medya Hesapları
                </h3>
                <p style={{ color: "var(--muted-color)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  Bunlar bu kişiye ait hesaplar; her ortak kendi hesabını girebilir. Şirketin ortak
                  hesapları Genel Ayarlar bölümünde yönetilir. Boş bırakılanlar gösterilmez.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {TEAM_SOCIAL_FIELDS.map((field) => (
                    <div className="glass-form-group" key={field.key}>
                      <label className="glass-label">{field.label}</label>
                      <input
                        type="url"
                        className="glass-input"
                        placeholder={field.placeholder}
                        value={(teamForm as any)[field.key] || ""}
                        onChange={(e) => setTeamForm({ ...teamForm, [field.key]: e.target.value })}
                      />
                    </div>
                  ))}
                  <div className="glass-form-group">
                    <label className="glass-label">WhatsApp Numarası</label>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="905448508960"
                      value={teamForm.whatsapp}
                      onChange={(e) => setTeamForm({ ...teamForm, whatsapp: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="glass-btn">
                    {editingTeamId ? "Üyeyi Güncelle" : "Ekip Üyesi Ekle"}
                  </button>
                  {editingTeamId && (
                    <button type="button" className="glass-btn glass-btn-outline" onClick={cancelEditingTeam}>
                      İptal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>Ekip Üyeleri</h2>
            <div className="project-list-modern">
              {team.length === 0 && (
                <p style={{ color: "var(--muted-color-light)" }}>Henüz ekip üyesi eklenmedi.</p>
              )}
              {team.map((m) => (
                <div key={m.id} className="project-card-modern" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {m.image ? (
                      <img
                        src={m.image}
                        alt={m.name}
                        style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          color: "#fff",
                          background: `linear-gradient(135deg, ${m.accent_color || "#C8102E"} 0%, #1a1a1a 100%)`,
                        }}
                      >
                        {m.initials}
                      </div>
                    )}
                    <div>
                      <h4 className="project-card-title" style={{ margin: 0 }}>{m.name}</h4>
                      <p className="project-card-cat" style={{ margin: 0, marginTop: "2px" }}>{m.role || "—"}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "var(--muted-color)", margin: 0 }}>
                    {[
                      m.linkedin_url && "LinkedIn",
                      m.instagram_url && "Instagram",
                      m.github_url && "GitHub",
                      m.twitter_url && "X",
                      m.whatsapp && "WhatsApp",
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Sosyal medya hesabı eklenmedi"}
                  </p>

                  <div className="project-card-actions" style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="glass-btn"
                      style={{ flex: 1, padding: "0.5rem", fontSize: "0.9rem" }}
                      onClick={() => startEditingTeam(m)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="glass-btn-danger"
                      style={{ flex: 1, padding: "0.5rem", fontSize: "0.9rem" }}
                      onClick={() => deleteTeamMember(m.id, m.name)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "admins" && (
          <div>
            <div className="admin-header">
              <h1 className="admin-title">Yönetici Yönetimi</h1>
              <p className="admin-subtitle">Sisteme yeni yönetici ekleyin veya mevcutları güncelleyin.</p>
            </div>

            <div className="glass-panel" style={{ marginBottom: "3rem", maxWidth: "600px" }}>
              <form onSubmit={handleAdminSubmit}>
                <div className="glass-form-group">
                  <label className="glass-label">Kullanıcı Adı</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="yeniadmin"
                    value={newAdminUser}
                    onChange={(e) => setNewAdminUser(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="glass-form-group">
                  <label className="glass-label">
                    Şifre {editingAdminId ? "(değiştirmeyecekseniz boş bırakın)" : "(en az 8 karakter)"}
                  </label>
                  <input
                    type="password"
                    className="glass-input"
                    placeholder="••••••••"
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required={!editingAdminId}
                  />
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="glass-btn">
                    {editingAdminId ? "Yöneticiyi Güncelle" : "Yönetici Ekle"}
                  </button>
                  {editingAdminId && (
                    <button type="button" className="glass-btn glass-btn-outline" onClick={cancelEditingAdmin}>
                      İptal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>Yöneticiler</h2>
            <div className="project-list-modern">
              {admins.length === 0 && (
                <p style={{ color: "var(--muted-color-light)" }}>Yönetici bulunamadı.</p>
              )}
              {admins.map((a) => (
                <div
                  key={a.id}
                  className="project-card-modern"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}
                >
                  <div>
                    <h4 className="project-card-title" style={{ margin: 0 }}>@{a.username}</h4>
                    {a.id === 1 && (
                      <p className="project-card-cat" style={{ margin: 0, marginTop: "4px", fontSize: "0.8rem" }}>
                        Ana Yönetici
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="glass-btn"
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                      onClick={() => startEditingAdmin(a)}
                    >
                      Düzenle
                    </button>
                    {a.id !== 1 && (
                      <button className="glass-btn-danger" onClick={() => deleteAdmin(a.id)}>
                        Sil
                      </button>
                    )}
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
