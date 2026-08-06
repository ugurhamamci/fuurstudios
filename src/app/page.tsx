import { query } from "@/lib/db";
import { Metadata } from "next";
import Script from "next/script";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settingsRows = await query(`SELECT * FROM settings`);
  const settings: any = {};
  settingsRows.forEach((r: any) => settings[r.setting_key] = r.setting_value);

  const title = settings.site_meta_title || "FUUR STUDIO - Dijital Ajans";
  const description = settings.site_meta_description || "Dijital dönüşüm ortağınız.";

  return {
    title,
    description,
    keywords: ["web tasarım", "dijital ajans", "yapay zeka", "e-ticaret", "mobil uygulama", "istanbul web ajansı", "seo", "yazılım", "sosyal medya yönetimi"],
    authors: [{ name: "FUUR STUDIO" }],
    creator: "FUUR STUDIO",
    openGraph: {
      title,
      description,
      url: "https://www.fuurstudio.com",
      siteName: "FUUR STUDIO",
      images: [
        {
          url: "https://www.fuurstudio.com/assets/logo-full-white.png",
          width: 800,
          height: 600,
          alt: "FUUR STUDIO Dijital Ajans"
        },
      ],
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.fuurstudio.com/assets/logo-full-white.png"],
    },
    alternates: {
      canonical: "https://www.fuurstudio.com",
    },
  };
}

export default async function Home() {
  const settingsRows = await query(`SELECT * FROM settings`);
  const settings: any = {};
  settingsRows.forEach((r: any) => settings[r.setting_key] = r.setting_value);

  const projects = await query(`SELECT * FROM projects ORDER BY id DESC`);

  const waNumber = settings.whatsappNumber || "905448508960";
  const email = settings.email || "info@fuurstudio.com";

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "FUUR STUDIO",
    "image": "https://www.fuurstudio.com/assets/logo-full-white.png",
    "@id": "https://www.fuurstudio.com",
    "url": "https://www.fuurstudio.com",
    "telephone": waNumber,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "İstanbul",
      "addressCountry": "TR"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />


  
  <nav className="nav" id="navbar">
    <div className="nav__inner">
      
      <a href="#" className="nav__logo" aria-label="FUUR STUDIO">
        <img src="assets/logo-bw-2.png" data-logo-dark="assets/logo-bw-2.png" data-logo-light="assets/logo-bw-1.png" alt="FUUR STUDIO" className="nav__logo-img js-theme-logo" />
      </a>

      
      <div className="nav__links hide-mobile">
        <a href="#services" className="nav__link" data-i18n="nav.services">Hizmetler</a>
        <a href="#portfolio" className="nav__link" data-i18n="nav.portfolio">Projeler</a>
        <a href="#about" className="nav__link" data-i18n="nav.about">Hakkımızda</a>
        <a href="#team" className="nav__link" data-i18n="nav.team">Ekip</a>
        <a href="#testimonials" className="nav__link" data-i18n="nav.testimonials">Yorumlar</a>
        <a href="#blog" className="nav__link" data-i18n="nav.blog">Blog</a>
        <a href="#contact" className="nav__link" data-i18n="nav.contact">İletişim</a>
      </div>

      
      <div className="nav__actions">
        
        <div className="lang-toggle hide-mobile">
          <button className="lang-toggle__option active" data-lang="tr">TR</button>
          <button className="lang-toggle__option" data-lang="en">EN</button>
        </div>

        
        <button className="toggle-btn" id="theme-toggle" aria-label="Tema değiştir">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>

        
        <a href="#contact" className="btn btn--primary btn--sm hide-mobile" data-i18n="nav.cta">Projenizi Görüşelim</a>

        
        <button className="nav__hamburger" aria-label="Menü">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    
    <div className="nav__mobile-menu">
      <a href="#services" className="nav__link" data-i18n="nav.services">Hizmetler</a>
      <a href="#portfolio" className="nav__link" data-i18n="nav.portfolio">Projeler</a>
      <a href="#about" className="nav__link" data-i18n="nav.about">Hakkımızda</a>
      <a href="#team" className="nav__link" data-i18n="nav.team">Ekip</a>
      <a href="#testimonials" className="nav__link" data-i18n="nav.testimonials">Yorumlar</a>
      <a href="#blog" className="nav__link" data-i18n="nav.blog">Blog</a>
      <a href="#contact" className="nav__link" data-i18n="nav.contact">İletişim</a>
      <div className="nav__mobile-actions">
        <div className="lang-toggle">
          <button className="lang-toggle__option active" data-lang="tr">TR</button>
          <button className="lang-toggle__option" data-lang="en">EN</button>
        </div>
        <a href="#contact" className="btn btn--primary btn--sm" data-i18n="nav.cta">Projenizi Görüşelim</a>
      </div>
    </div>
  </nav>


  
  <section className="hero section--lg" id="hero">
    <div className="container">
      <div className="hero__content">
        <span className="overline hero__overline" data-i18n="hero.overline">[ Dijital Dönüşüm Ortağınız ]</span>
        <h1 className="hero__title">
          <span data-i18n="hero.title.1">WEB SİTESİ DEĞİL,</span><br />
          <span className="text-gradient" data-i18n="hero.title.2">DİJİTAL PRESTİJ</span><br />
          <span data-i18n="hero.title.3">TASARLIYORUZ.</span>
        </h1>
        <p className="hero__description" data-i18n="hero.description">
          Sıradan şablonlar değil, markanıza özel, yüksek dönüşüm oranlı ve performansa odaklanmış modern dijital deneyimler geliştiriyoruz.
        </p>
        <div className="hero__actions">
          <a href="#services" className="btn btn--secondary btn--lg" data-i18n="hero.cta.primary">Hizmetlerimizi İnceleyin</a>
          <a href="#contact" className="btn btn--ghost btn--lg" data-i18n="hero.cta.secondary">Bizimle İletişime Geçin</a>
        </div>
      </div>

      
      <div className="hero__visual">
        <div className="hero__visual-wrapper">
          <div className="hero__visual-ring"></div>
          <div className="hero__visual-ring-2"></div>
          
          <img src="assets/logo-full-white.png" data-logo-dark="assets/logo-full-white.png" data-logo-light="assets/logo-full.png" alt="FUUR STUDIO" className="hero__visual-logo js-theme-logo" />

          
          <div className="hero__badge hero__badge--top-right">
            <svg className="hero__badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span data-i18n="hero.badge.performance">Top Performance</span>
          </div>

          <div className="hero__badge hero__badge--bottom-left">
            <svg className="hero__badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span data-i18n="hero.badge.ai">AI Integrated</span>
          </div>

          <div className="hero__badge hero__badge--bottom-right">
            <svg className="hero__badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            <span data-i18n="hero.badge.design">Award Winning</span>
          </div>
        </div>
      </div>

      
      <div className="hero__bottom">
        <div className="hero__tech-strip">
          <span className="hero__tech-label" data-i18n="hero.tech.title">TECH STACK</span>
          <div className="hero__tech-logos">
            <div className="hero__tech-item">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.051 17.576l-4.524-4.524 1.414-1.414 3.11 3.11 7.293-7.293 1.414 1.414-8.707 8.707z"/></svg>
              React & Next.js
            </div>
            <div className="hero__tech-item">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.051 17.576l-4.524-4.524 1.414-1.414 3.11 3.11 7.293-7.293 1.414 1.414-8.707 8.707z"/></svg>
              Node.js
            </div>
            <div className="hero__tech-item">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.051 17.576l-4.524-4.524 1.414-1.414 3.11 3.11 7.293-7.293 1.414 1.414-8.707 8.707z"/></svg>
              Python & AI Models
            </div>
            <div className="hero__tech-item">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.051 17.576l-4.524-4.524 1.414-1.414 3.11 3.11 7.293-7.293 1.414 1.414-8.707 8.707z"/></svg>
              PostgreSQL
            </div>
            <div className="hero__tech-item">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.051 17.576l-4.524-4.524 1.414-1.414 3.11 3.11 7.293-7.293 1.414 1.414-8.707 8.707z"/></svg>
              AWS & Cloud
            </div>
          </div>
        </div>

        <div className="hero__metrics">
          <div className="hero__metric">
            <span className="hero__metric-value">250<span className="accent">+</span></span>
            <span className="hero__metric-label" data-i18n="hero.metric.1">Projects</span>
          </div>
          <div className="hero__metric">
            <span className="hero__metric-value">98<span className="accent">%</span></span>
            <span className="hero__metric-label" data-i18n="hero.metric.2">Success Rate</span>
          </div>
          <div className="hero__metric">
            <span className="hero__metric-value">24<span className="accent">/</span>7</span>
            <span className="hero__metric-label" data-i18n="hero.metric.3">Support</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="hero__bg">
      <div className="orb orb--red hero__orb-1"></div>
      <div className="orb orb--white hero__orb-2"></div>
    </div>
  </section>


  
  <section className="services section" id="services">
    <div className="container">
      <div className="section-header section-header--split reveal">
        <div>
          <span className="overline" data-i18n="services.overline">Neler Yapıyoruz?</span>
          <h2 className="heading-lg" data-i18n="services.title">HİZMETLERİMİZ</h2>
        </div>
        <p className="body-sm" style={{maxWidth: "380px"}} data-i18n="services.subtitle">
          İşletmenizi dijital dünyada konumlandırırken ihtiyacınız olan tüm teknik ve kreatif altyapıyı sağlıyoruz.
        </p>
      </div>

      <div className="services__grid stagger-children">
        
        <div className="card card--accent-hover reveal">
          <span className="card__number">01 //</span>
          <h3 className="card__title" data-i18n="services.1.title">Kurumsal Web Siteleri</h3>
          <p className="card__description" data-i18n="services.1.desc">
            Hızlı, modern, SEO ve mobil uyumlu, markanızın kalitesini ve niş yapısını yansıtan prestijli web siteleri tasarlıyoruz.
          </p>
          <span className="card__tags" data-i18n="services.1.tags">Next.js • Custom Design • SEO</span>
        </div>

        
        <div className="card card--accent-hover reveal">
          <span className="card__number">02 //</span>
          <h3 className="card__title" data-i18n="services.2.title">E-Ticaret Çözümleri</h3>
          <p className="card__description" data-i18n="services.2.desc">
            Satış odaklı, güvenli ödeme altyapısına sahip, kullanıcı deneyimi en üst düzeyde tutulmuş online mağazalar geliştiriyoruz.
          </p>
          <span className="card__tags" data-i18n="services.2.tags">Secure • Scalable • Conversive</span>
        </div>

        
        <div className="card card--accent-hover reveal">
          <span className="card__number">03 //</span>
          <h3 className="card__title" data-i18n="services.3.title">Yapay Zeka & Otomasyon</h3>
          <p className="card__description" data-i18n="services.3.desc">
            İş süreçlerinizi hızlandıran özel yazılımlar ve akıllı yapay zeka entegrasyonları ile operasyonel verimlilik sağlıyoruz.
          </p>
          <span className="card__tags" data-i18n="services.3.tags">AI Integrations • Workflow Automation</span>
        </div>

        
        <div className="card card--accent-hover reveal">
          <span className="card__number">04 //</span>
          <h3 className="card__title" data-i18n="services.4.title">Sosyal Medya Yönetimi</h3>
          <p className="card__description" data-i18n="services.4.desc">
            Strateji, kreatif içerik üretimi ve Meta Ads reklam yönetimi ile markanızı doğru kitleye ulaştırıyoruz.
          </p>
          <span className="card__tags" data-i18n="services.4.tags">Strategy • Content • Ads Management</span>
        </div>
      </div>
    </div>
  </section>


  
  <section className="portfolio section" id="portfolio">
    <div className="container">
      <div className="section-header section-header--split reveal">
        <div>
          <span className="overline" data-i18n="portfolio.overline">Çalışmalarımız</span>
          <h2 className="heading-lg" data-i18n="portfolio.title">PROJELER</h2>
        </div>
        <p className="body-sm" style={{maxWidth: "380px"}} data-i18n="portfolio.subtitle">
          Her projede markanın DNA'sını dijitale taşıyan, dönüşüm odaklı çözümler üretiyoruz.
        </p>
      </div>

      
      <div className="portfolio__filters reveal">
        <button className="portfolio__filter active" data-filter="all" data-i18n="portfolio.filter.all">Tümü</button>
        <button className="portfolio__filter" data-filter="web" data-i18n="portfolio.filter.web">Web</button>
        <button className="portfolio__filter" data-filter="ecommerce" data-i18n="portfolio.filter.ecommerce">E-Ticaret</button>
        <button className="portfolio__filter" data-filter="mobile" data-i18n="portfolio.filter.mobile">Mobil</button>
        <button className="portfolio__filter" data-filter="ai" data-i18n="portfolio.filter.ai">AI</button>
      </div>

      
      <div className="portfolio__grid stagger-children" id="portfolio-grid">
        {projects.map((p: any) => {
          let catText = p.category === 'web' ? 'Web Sitesi' : (p.category === 'ecommerce' ? 'E-Ticaret' : (p.category === 'mobile' ? 'Mobil Uygulama' : 'AI Çözümleri'));
          return (
            <div key={p.id} className="portfolio__item reveal" data-category={p.category}>
              <img src={p.image} alt={p.title} className="portfolio__image" loading="lazy" />
              <div className="portfolio__overlay">
                <span className="portfolio__category">{catText}</span>
                <h3 className="portfolio__title">{p.title}</h3>
                <p className="portfolio__desc">{p.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>


  
  <section className="about section" id="about">
    <div className="container">
      <div className="about__grid">
        
        <div className="about__text reveal-left">
          <span className="overline" data-i18n="about.overline">Biz Kimiz?</span>
          <h2 className="heading-lg" data-i18n="about.title">HAKKIMIZDA</h2>
          <p data-i18n="about.p1">
            FUUR STUDIO olarak, İstanbul merkezli bir yazılım ve dijital dönüşüm şirketiyiz. Amacımız sadece web sitesi yapmak değil; markanızın dijital dünyada hak ettiği prestiji inşa etmektir.
          </p>
          <p data-i18n="about.p2">
            Her projemizde performans, estetik ve dönüşüm üçgeninde mükemmelliği hedefliyoruz. Şablon çözümler yerine, markanıza özel tasarlanmış dijital deneyimler sunuyoruz.
          </p>
          <p data-i18n="about.p3">
            Yapay zeka entegrasyonları, özel yazılım geliştirme ve sosyal medya stratejileri ile işletmelerin dijital olgunluğunu bir üst seviyeye taşıyoruz.
          </p>
        </div>

        
        <div className="metrics reveal-right">
          <div className="metric">
            <div className="metric__value" data-count="250" data-suffix="+">0</div>
            <div className="metric__label" data-i18n="metric.projects">Tamamlanan Proje</div>
          </div>
          <div className="metric">
            <div className="metric__value metric__value--white" data-count="98">0</div>
            <div className="metric__label" data-i18n="metric.speed">Site Hız Skoru</div>
          </div>
          <div className="metric">
            <div className="metric__value metric__value--white" data-count="98" data-prefix="%" >0</div>
            <div className="metric__label" data-i18n="metric.satisfaction">Müşteri Memnuniyeti</div>
          </div>
          <div className="metric">
            <div className="metric__value metric__value--white" data-count="5" data-suffix="+">0</div>
            <div className="metric__label" data-i18n="metric.experience">Yıllık Tecrübe</div>
          </div>
        </div>
      </div>
    </div>
  </section>


  
  <section className="team section" id="team">
    <div className="container">
      <div className="section-header section-header--center reveal">
        <span className="overline" data-i18n="team.overline">Arkamızdaki Güç</span>
        <h2 className="heading-lg" data-i18n="team.title">EKİBİMİZ</h2>
        <p className="body-base" style={{maxWidth: "500px"}} data-i18n="team.subtitle">
          Her biri alanında uzman, tutkulu profesyonellerden oluşan bir ekibiz.
        </p>
      </div>

      <div className="team__grid stagger-children">
        
        <div className="team__member reveal">
          <div className="team__avatar" style={{background: "linear-gradient(135deg, var(--brand-red) 0%, #1a1a1a 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "1.5rem", fontFamily: "var(--font-heading)", width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto var(--space-5)"}}>UY</div>
          <h3 className="team__name" data-i18n="team.1.name">Uğur Yılmaz</h3>
          <p className="team__role" data-i18n="team.1.role">Kurucu & Full-Stack Developer</p>
          <p className="team__bio" data-i18n="team.1.bio">Dijital çözümler ve AI entegrasyonları konusunda uzman.</p>
          <div className="team__socials">
            <a href="https://www.instagram.com/fuurstudio/" target="_blank" className="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://wa.me/905448508960" target="_blank" className="social-link" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>

        
        <div className="team__member reveal">
          <div className="team__avatar" style={{background: "linear-gradient(135deg, #667eea 0%, #1a1a1a 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "1.5rem", fontFamily: "var(--font-heading)", width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto var(--space-5)"}}>EK</div>
          <h3 className="team__name" data-i18n="team.2.name">Elif Karaca</h3>
          <p className="team__role" data-i18n="team.2.role">UI/UX Tasarımcı</p>
          <p className="team__bio" data-i18n="team.2.bio">Kullanıcı odaklı, estetik ve işlevsel arayüzler tasarlıyor.</p>
          <div className="team__socials">
            <a href="#" className="social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

        
        <div className="team__member reveal">
          <div className="team__avatar" style={{background: "linear-gradient(135deg, #2dd4bf 0%, #1a1a1a 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "1.5rem", fontFamily: "var(--font-heading)", width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto var(--space-5)"}}>BD</div>
          <h3 className="team__name" data-i18n="team.3.name">Burak Demir</h3>
          <p className="team__role" data-i18n="team.3.role">Backend Developer</p>
          <p className="team__bio" data-i18n="team.3.bio">Ölçeklenebilir ve güvenli sunucu mimarileri kuruyor.</p>
          <div className="team__socials">
            <a href="#" className="social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>

        
        <div className="team__member reveal">
          <div className="team__avatar" style={{background: "linear-gradient(135deg, #f59e0b 0%, #1a1a1a 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "1.5rem", fontFamily: "var(--font-heading)", width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto var(--space-5)"}}>SA</div>
          <h3 className="team__name" data-i18n="team.4.name">Selin Aydın</h3>
          <p className="team__role" data-i18n="team.4.role">Dijital Pazarlama Uzmanı</p>
          <p className="team__bio" data-i18n="team.4.bio">Meta Ads ve sosyal medya stratejileri ile büyüme sağlıyor.</p>
          <div className="team__socials">
            <a href="#" className="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>


  
  <section className="testimonials section" id="testimonials">
    <div className="container">
      <div className="section-header section-header--center reveal">
        <span className="overline" data-i18n="testimonials.overline">Müşterilerimiz Ne Diyor?</span>
        <h2 className="heading-lg" data-i18n="testimonials.title">YORUMLAR</h2>
      </div>

      <div className="testimonials__carousel reveal-scale">
        <div className="testimonials__track">
          
          <div className="testimonials__slide">
            <div className="testimonial-card">
              <div className="testimonial-card__quote">"</div>
              <div className="stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p className="testimonial-card__text" data-i18n="testimonial.1.text">
                FUUR STUDIO ile çalışmak, dijital dünyada fark yaratmamızı sağladı. Web sitemizin performansı ve tasarımı beklentilerimizin çok üzerinde.
              </p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" style={{background: "linear-gradient(135deg, var(--brand-red), #333)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "600", fontSize: "0.875rem", width: "48px", height: "48px", borderRadius: "50%", border: "2px solid var(--brand-red)", flexShrink: "0"}}>AK</div>
                <div className="testimonial-card__info">
                  <p className="testimonial-card__name" data-i18n="testimonial.1.name">Ahmet Kaya</p>
                  <p className="testimonial-card__company" data-i18n="testimonial.1.company">Meridian Architecture CEO</p>
                </div>
              </div>
            </div>
          </div>

          
          <div className="testimonials__slide">
            <div className="testimonial-card">
              <div className="testimonial-card__quote">"</div>
              <div className="stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p className="testimonial-card__text" data-i18n="testimonial.2.text">
                E-ticaret sitemizi sıfırdan tasarlayıp, satış oranlarımızı %180 artırdılar. Profesyonellik ve yaratıcılık bir arada.
              </p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" style={{background: "linear-gradient(135deg, #667eea, #333)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "600", fontSize: "0.875rem", width: "48px", height: "48px", borderRadius: "50%", border: "2px solid var(--brand-red)", flexShrink: "0"}}>ZÖ</div>
                <div className="testimonial-card__info">
                  <p className="testimonial-card__name" data-i18n="testimonial.2.name">Zeynep Öztürk</p>
                  <p className="testimonial-card__company" data-i18n="testimonial.2.company">Vogue Boutique Kurucu</p>
                </div>
              </div>
            </div>
          </div>

          
          <div className="testimonials__slide">
            <div className="testimonial-card">
              <div className="testimonial-card__quote">"</div>
              <div className="stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p className="testimonial-card__text" data-i18n="testimonial.3.text">
                AI entegrasyonları sayesinde iş süreçlerimizi otomatize ettik. Zaman ve maliyet tasarrufu inanılmaz seviyede.
              </p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" style={{background: "linear-gradient(135deg, #2dd4bf, #333)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "600", fontSize: "0.875rem", width: "48px", height: "48px", borderRadius: "50%", border: "2px solid var(--brand-red)", flexShrink: "0"}}>MA</div>
                <div className="testimonial-card__info">
                  <p className="testimonial-card__name" data-i18n="testimonial.3.name">Murat Arslan</p>
                  <p className="testimonial-card__company" data-i18n="testimonial.3.company">FinTrack CTO</p>
                </div>
              </div>
            </div>
          </div>

          
          <div className="testimonials__slide">
            <div className="testimonial-card">
              <div className="testimonial-card__quote">"</div>
              <div className="stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p className="testimonial-card__text" data-i18n="testimonial.4.text">
                Sosyal medya yönetiminde gösterdikleri strateji ve içerik kalitesi ile markamızın bilinirliğini 3 katına çıkardılar.
              </p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" style={{background: "linear-gradient(135deg, #f59e0b, #333)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "600", fontSize: "0.875rem", width: "48px", height: "48px", borderRadius: "50%", border: "2px solid var(--brand-red)", flexShrink: "0"}}>AÇ</div>
                <div className="testimonial-card__info">
                  <p className="testimonial-card__name" data-i18n="testimonial.4.name">Ayşe Çelik</p>
                  <p className="testimonial-card__company" data-i18n="testimonial.4.company">NovaCare Pazarlama Müdürü</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="testimonials__nav">
          <button className="testimonials__nav-btn" id="testimonial-prev" aria-label="Önceki">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="testimonials__nav-btn" id="testimonial-next" aria-label="Sonraki">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        
        <div className="testimonials__dots">
          <button className="testimonials__dot active" aria-label="Slide 1"></button>
          <button className="testimonials__dot" aria-label="Slide 2"></button>
          <button className="testimonials__dot" aria-label="Slide 3"></button>
          <button className="testimonials__dot" aria-label="Slide 4"></button>
        </div>
      </div>
    </div>
  </section>


  
  <section className="blog section" id="blog">
    <div className="container">
      <div className="section-header section-header--split reveal">
        <div>
          <span className="overline" data-i18n="blog.overline">İçeriklerimiz</span>
          <h2 className="heading-lg" data-i18n="blog.title">BLOG</h2>
        </div>
        <p className="body-sm" style={{maxWidth: "380px"}} data-i18n="blog.subtitle">
          Dijital dünyadan en güncel bilgiler, trendler ve stratejiler.
        </p>
      </div>

      <div className="blog__grid stagger-children">
        
        <article className="blog-card reveal">
          <div className="blog-card__image-wrapper">
            <img src="assets/images/blog-1.jpg" alt="Web Tasarım Trendleri" className="blog-card__image" loading="lazy" />
          </div>
          <div className="blog-card__body">
            <div className="blog-card__meta">
              <span className="blog-card__category" data-i18n="blog.1.category">Web Tasarım</span>
              <span className="blog-card__date" data-i18n="blog.1.date">5 Haziran 2026</span>
            </div>
            <h3 className="blog-card__title" data-i18n="blog.1.title">2026'da Web Tasarım Trendleri: Neler Değişiyor?</h3>
            <p className="blog-card__excerpt" data-i18n="blog.1.excerpt">
              Yapay zeka destekli tasarım, mikro-animasyonlar ve dark mode tercihleri ile web tasarımın geleceğini şekillendiren trendleri inceliyoruz.
            </p>
            <a href="#" className="blog-card__link" data-i18n="blog.readmore">
              Devamını Oku
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </article>

        
        <article className="blog-card reveal">
          <div className="blog-card__image-wrapper">
            <img src="assets/images/blog-2.jpg" alt="AI KOBİ" className="blog-card__image" loading="lazy" />
          </div>
          <div className="blog-card__body">
            <div className="blog-card__meta">
              <span className="blog-card__category" data-i18n="blog.2.category">Yapay Zeka</span>
              <span className="blog-card__date" data-i18n="blog.2.date">28 Mayıs 2026</span>
            </div>
            <h3 className="blog-card__title" data-i18n="blog.2.title">KOBİ'ler İçin AI: Küçük Bütçeyle Büyük Sonuçlar</h3>
            <p className="blog-card__excerpt" data-i18n="blog.2.excerpt">
              Yapay zeka artık sadece büyük şirketlerin tekelinde değil. KOBİ'lerin AI ile nasıl rekabet avantajı kazanabileceğini anlatıyoruz.
            </p>
            <a href="#" className="blog-card__link" data-i18n="blog.readmore">
              Devamını Oku
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </article>

        
        <article className="blog-card reveal">
          <div className="blog-card__image-wrapper">
            <img src="assets/images/blog-3.jpg" alt="Meta Ads" className="blog-card__image" loading="lazy" />
          </div>
          <div className="blog-card__body">
            <div className="blog-card__meta">
              <span className="blog-card__category" data-i18n="blog.3.category">Dijital Pazarlama</span>
              <span className="blog-card__date" data-i18n="blog.3.date">15 Mayıs 2026</span>
            </div>
            <h3 className="blog-card__title" data-i18n="blog.3.title">Meta Ads ile Dönüşüm Oranlarınızı Katlamak</h3>
            <p className="blog-card__excerpt" data-i18n="blog.3.excerpt">
              Doğru hedefleme, kreatif içerik ve A/B test stratejileri ile Meta reklamlarından maksimum verim almanın yollarını paylaşıyoruz.
            </p>
            <a href="#" className="blog-card__link" data-i18n="blog.readmore">
              Devamını Oku
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>


  
  <section className="contact section" id="contact">
    <div className="container">
      <div className="contact__grid">
        
        <div className="contact__info reveal-left">
          <div>
            <span className="overline" data-i18n="contact.overline">Bir Projeniz mi Var?</span>
            <h2 className="heading-lg" data-i18n="contact.title">BİZE ULAŞIN</h2>
            <p className="body-base" data-i18n="contact.description">
              Projeleriniz, iş birlikleri veya detaylı bilgi almak için hemen bizimle iletişime geçin.
            </p>
          </div>

          <div className="contact__details">
            
            <div className="contact__detail">
              <div className="contact__detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div className="contact__detail-text">
                <span className="contact__detail-label" data-i18n="contact.phone.label">Telefon / WhatsApp</span>
                <span className="contact__detail-value"><a href="tel:+905448508960">0544 850 89 60</a></span>
              </div>
            </div>

            
            <div className="contact__detail">
              <div className="contact__detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div className="contact__detail-text">
            <span className="contact__detail-label" data-i18n="contact.email.label">E-Posta</span>
            <span className="contact__detail-value"><a href="mailto:{email}">{email}</a></span>
          </div>
            </div>

            
            <div className="contact__detail">
              <div className="contact__detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div className="contact__detail-text">
                <span className="contact__detail-label" data-i18n="contact.address.label">Konum</span>
                <span className="contact__detail-value" data-i18n="contact.address.value">İstanbul, Türkiye</span>
              </div>
            </div>

            
            <div className="contact__detail">
              <div className="contact__detail-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <div className="contact__detail-text">
                <span className="contact__detail-label" data-i18n="contact.social.label">Sosyal Medya</span>
                <div className="social-links" style={{marginTop: "var(--space-2)"}}>
                  <a href="https://www.instagram.com/fuurstudio/" target="_blank" className="social-link" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                  <a href="https://wa.me/905448508960" target="_blank" className="social-link" aria-label="WhatsApp">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                  <a href="#" target="_blank" className="social-link" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <form className="contact__form reveal-right" id="contact-form">
          <div className="contact__form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="form-name" data-i18n="contact.form.name">Adınız Soyadınız</label>
              <input className="form-input" type="text" id="form-name" required data-i18n-placeholder="contact.form.name" placeholder="Adınız Soyadınız" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="form-email" data-i18n="contact.form.email">E-posta Adresiniz</label>
              <input className="form-input" type="email" id="form-email" required data-i18n-placeholder="contact.form.email" placeholder="E-posta Adresiniz" />
            </div>
          </div>

          <div className="contact__form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="form-phone" data-i18n="contact.form.phone">Telefon Numaranız</label>
              <input className="form-input" type="tel" id="form-phone" data-i18n-placeholder="contact.form.phone" placeholder="Telefon Numaranız" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="form-service" data-i18n="contact.form.service">İlgilendiğiniz Hizmet</label>
              <select className="form-select" id="form-service">
                <option value="" data-i18n="contact.form.service.select">Hizmet Seçiniz</option>
                <option value="Kurumsal Web Sitesi" data-i18n="contact.form.service.1">Kurumsal Web Sitesi</option>
                <option value="E-Ticaret Çözümü" data-i18n="contact.form.service.2">E-Ticaret Çözümü</option>
                <option value="Yapay Zeka & Otomasyon" data-i18n="contact.form.service.3">Yapay Zeka & Otomasyon</option>
                <option value="Sosyal Medya Yönetimi" data-i18n="contact.form.service.4">Sosyal Medya Yönetimi</option>
                <option value="Diğer" data-i18n="contact.form.service.5">Diğer</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="form-message" data-i18n="contact.form.message">Mesajınız</label>
            <textarea className="form-textarea" id="form-message" required data-i18n-placeholder="contact.form.message.placeholder" placeholder="Projeniz hakkında kısaca bilgi verin..."></textarea>
          </div>

          <button type="submit" className="btn btn--primary btn--lg" data-i18n="contact.form.submit">
            WhatsApp ile Gönder
          </button>
        </form>
      </div>
    </div>
  </section>


  
  <footer className="footer">
    <div className="container">
      <div className="footer__grid">
        <div className="footer__brand">
          <a href="#" className="nav__logo" aria-label="FUUR STUDIO">
            <img src="assets/logo-horizontal-white.png" data-logo-dark="assets/logo-horizontal-white.png" data-logo-light="assets/logo-horizontal.png" alt="FUUR STUDIO" className="nav__logo-img js-theme-logo" />
          </a>
          <p data-i18n="footer.description">Dijital dönüşüm ortağınız. Yazılım, AI ve tasarım çözümleri ile markanızı bir adım öne taşıyoruz.</p>
          <div className="social-links" style={{marginTop: "var(--space-6)"}}>
            <a href="https://www.instagram.com/fuurstudio/" target="_blank" className="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://wa.me/905448508960" target="_blank" className="social-link" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a href="#" target="_blank" className="social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

        
        <div>
          <h4 className="footer__col-title" data-i18n="footer.col.services">Hizmetler</h4>
          <div className="footer__links">
            <a href="#services" className="footer__link" data-i18n="footer.link.web">Web Siteleri</a>
            <a href="#services" className="footer__link" data-i18n="footer.link.ecommerce">E-Ticaret</a>
            <a href="#services" className="footer__link" data-i18n="footer.link.ai">AI & Otomasyon</a>
            <a href="#services" className="footer__link" data-i18n="footer.link.social">Sosyal Medya</a>
          </div>
        </div>

        
        <div>
          <h4 className="footer__col-title" data-i18n="footer.col.company">Şirket</h4>
          <div className="footer__links">
            <a href="#about" className="footer__link" data-i18n="footer.link.about">Hakkımızda</a>
            <a href="#team" className="footer__link" data-i18n="footer.link.team">Ekibimiz</a>
            <a href="#blog" className="footer__link" data-i18n="footer.link.blog">Blog</a>
            <a href="#" className="footer__link" data-i18n="footer.link.careers">Kariyer</a>
          </div>
        </div>

        
        <div>
          <h4 className="footer__col-title" data-i18n="footer.col.connect">İletişim</h4>
          <div className="footer__links">
            <a href="https://wa.me/905448508960" target="_blank" className="footer__link" data-i18n="footer.link.whatsapp">WhatsApp</a>
            <a href="https://www.instagram.com/fuurstudio/" target="_blank" className="footer__link" data-i18n="footer.link.instagram">Instagram</a>
            <a href="#" className="footer__link" data-i18n="footer.link.linkedin">LinkedIn</a>
            <a href="mailto:info@fuurstudio.com" className="footer__link" data-i18n="footer.link.email">E-posta</a>
          </div>
        </div>
      </div>

      
      <div className="footer__bottom">
        <p className="footer__copyright" data-i18n="footer.copyright">© 2026 FUUR STUDIO. Tüm hakları saklıdır.</p>
        <button className="footer__scroll-top" id="scroll-top">
          <span data-i18n="footer.scrolltop">Yukarı Çık</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
      </div>
    </div>
  </footer>

  
  
  
  
  
  
  
  


      {/* Legacy Scripts */}
      <Script id="globals" strategy="beforeInteractive">
        {`window.waNumber = "${waNumber}";`}
      </Script>
      <Script src="/js/theme.js" strategy="afterInteractive" />
      <Script src="/js/language.js" strategy="afterInteractive" />
      <Script src="/js/navigation.js" strategy="afterInteractive" />
      <Script src="/js/animations.js" strategy="afterInteractive" />
      <Script src="/js/testimonials.js" strategy="afterInteractive" />
      <Script src="/js/main.js" strategy="afterInteractive" />
    </>
  );
}
