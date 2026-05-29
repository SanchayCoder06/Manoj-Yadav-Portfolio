import { useState, useEffect, useRef, useCallback } from "react";   

// ── Google Fonts & Global Styles ──────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Bebas+Neue&display=swap');
    :root {
      --gold: #C9A84C;
      --gold-light: #F0D080;
      --gold-glow: rgba(201,168,76,0.35);
      --crimson: #8B1A2A;
      --ink: #0A0608;
      --parchment: #F5EDD8;
      --sage: #3D5A4A;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: var(--ink); color: var(--parchment); font-family: 'Cormorant Garamond', serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--ink); }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }
    @keyframes shimmer {
      0%,100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    @keyframes float {
      0%,100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    @keyframes pulse-glow {
      0%,100% { box-shadow: 0 0 20px var(--gold-glow), 0 0 40px var(--gold-glow); }
      50% { box-shadow: 0 0 40px var(--gold-glow), 0 0 80px var(--gold-glow), 0 0 120px var(--gold-glow); }
    }
    @keyframes title-reveal {
      from { opacity: 0; transform: translateY(60px) skewY(3deg); filter: blur(8px); }
      to { opacity: 1; transform: translateY(0) skewY(0deg); filter: blur(0); }
    }
    @keyframes vinyl-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes slide-gallery {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes award-pop {
      0% { opacity: 0; transform: scale(0.7) rotateY(30deg); }
      100% { opacity: 1; transform: scale(1) rotateY(0deg); }
    }
    @keyframes particle-rise {
      0% { transform: translateY(0) scale(1); opacity: 1; }
      100% { transform: translateY(-120px) scale(0); opacity: 0; }
    }
    .shimmer-text {
      background: linear-gradient(90deg, var(--gold), var(--gold-light), #fff8dc, var(--gold-light), var(--gold));
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s ease infinite;
    }
    .section-reveal {
      opacity: 0;
      transform: translateY(50px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .section-reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .nav-link::after {
      content: '';
      display: block;
      height: 1px;
      width: 0;
      background: var(--gold);
      transition: width 0.3s ease;
    }
    .nav-link:hover::after { width: 100%; }
    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--gold);
      animation: particle-rise 1.5s ease-out forwards;
      pointer-events: none;
    }
    .resp-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5rem;
      align-items: center;
    }
    .resp-grid-start {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }
    .section-pad {
      padding: 8rem 2rem;
    }
    /* Social fab */
    .social-fab-wrap {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: fit-content;
    }
    .social-fab-icons {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      opacity: 0;
      transform: translateY(20px);
      visibility: hidden;
      pointer-events: none;
      transition:
        opacity 0.35s ease,
        transform 0.35s ease,
        visibility 0.35s;
    }
    .social-fab-wrap.active .social-fab-icons {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
      visibility: visible;
    }
    .social-icon-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-decoration: none;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
      transition: transform 0.25s ease;
    }
    .social-icon-btn:hover {
      transform: scale(1.12);
    }
    .fab-main {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(10,6,8,0.85);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.12);
      color: #fff;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      cursor: pointer;
      transition: transform 0.35s ease;
      animation: pulse-glow 3s ease-in-out infinite;
    }
    .social-fab-wrap.active .fab-main {
      transform: scale(1.1) rotate(8deg);
    }
    @media (max-width: 768px) {
      .hidden-mobile { display: none !important; }
      .resp-grid, .resp-grid-start {
        grid-template-columns: 1fr !important;
        gap: 3rem !important;
      }
      .section-pad { padding: 4rem 1.5rem !important; }
      .nav-container { padding: 1rem 1.5rem !important; }
      .hero-title { font-size: 4rem !important; }
      #songs { padding: 4rem 0 7rem !important; }
      .sc-card { width: 180px !important; }
      .sc-card img { height: 180px !important; }
    }
    @media (min-width: 769px) {
      .mobile-menu-btn { display: none !important; }
    }
  `}</style>
);

// ── Nav ──────────────────────────────────────────────────────────────────────
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = ["Home", "About", "Songs", "Awards", "Gallery"];

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [open]);

  return (
    <>
      <nav className="nav-container" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "1rem 2rem",
        background: scrolled || open ? "rgba(10,6,8,0.95)" : "transparent",
        backdropFilter: scrolled || open ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.2)" : "none",
        transition: "all 0.4s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", zIndex: 101, cursor: "pointer" }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)",
            transition: "all 0.5s ease"
          }}>
            <span style={{ fontFamily: "'Cinzel Decorative'", color: "#fff", fontSize: "1rem" }}>M</span>
          </div>
          <span style={{
            fontFamily: "'Cinzel Decorative'", color: "#fff",
            fontSize: "1rem", letterSpacing: "0.1em",
            display: "none"
          }} className="hidden-mobile" id="nav-brand">MANOJ YADAV</span>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="hidden-mobile">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link"
             style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: "14px",
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.75)",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}>
               {l}
            </a>
          ))}

          {/* MuddaScope logo */}
          <a href="https://muddascope.com" target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "120px", height: "40px", borderRadius: "20px", overflow: "hidden",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)", transition: "all 0.45s ease", cursor: "pointer",
              flexShrink: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.14)";
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.25)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)";
            }}
          >
            <img src="/logo.jpeg" alt="MuddaScope Logo"
              style={{ width: "260px", height: "auto", objectFit: "contain", borderRadius: "28px", display: "block" }} />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          style={{
            background: "transparent", border: "none",
            color: "rgba(255,255,255,0.75)", fontSize: "1.5rem",
            cursor: "pointer", zIndex: 101, padding: "0 0.5rem"
          }}
          aria-label="Toggle Menu"
        >
          {open ? "✕" : "♫"}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, width: "100%", height: "75vh",
        background: "rgba(10,6,8,0.96)", backdropFilter: "blur(20px)",
        zIndex: 99, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "2.5rem",
        borderRadius: "2.5rem 2.5rem 0 0",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 -10px 40px rgba(0,0,0,0.45)",
        transition: "transform 0.5s ease, opacity 0.5s ease",
        transform: open ? "translateY(0)" : "translateY(100%)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none"
      }}>
        {links.map((l, i) => (
          <a key={l} href={`#${l.toLowerCase()}`}
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300, fontSize: "1.4rem",
              letterSpacing: "0.18em", color: "var(--parchment)",
              textDecoration: "none", textTransform: "uppercase",
              transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(20px)"
            }}>
            {l}
          </a>
        ))}
      </div>
    </>
  );
};

// ── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const [particles, setParticles] = useState([]);
  // FIX 1: Added fabOpen state — FAB now toggles only on click, not hover
  const [fabOpen, setFabOpen] = useState(false);

  const addParticle = (e) => {
    const id = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    setParticles(p => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 1600);
  };

  return (
    <section id="home" onClick={addParticle} style={{
      position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", overflow: "hidden", cursor: "crosshair"
    }}>
      <style>{`
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        .typewriter-manoj {
          overflow: hidden; white-space: nowrap; width: fit-content;
          animation: typing 1.4s steps(6, end) forwards;
        }
        .typewriter-yadav {
          overflow: hidden; white-space: nowrap; width: 0;
          animation: typing 1.4s steps(5, end) 1.6s forwards;
        }
        .btn-primary {
          position: relative; overflow: hidden; z-index: 1;
          color: #fff; border: 1px solid #fff;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease;
        }
        .btn-primary::before {
          content: ''; position: absolute; top:0; left:0; right:0; bottom:0;
          background: #fff; transform: scaleX(0); transform-origin: right;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); z-index: -1;
        }
        .btn-primary:hover { color: #0A0608 !important; transform: translateY(-4px); box-shadow: 0 10px 20px rgba(255,255,255,0.15); }
        .btn-primary:hover::before { transform: scaleX(1); transform-origin: left; }
        .btn-secondary {
          color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .btn-secondary:hover {
          color: #fff !important; border-color: #fff !important;
          transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }
      `}</style>

      {/* BG photo */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img src="pap.jpg" alt="bg"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) brightness(0.25) saturate(0.6)" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(10,6,8,0.95) 0%, rgba(10,6,8,0.4) 50%, rgba(10,6,8,0.1) 100%)"
        }} />
      </div>

      {/* Click Particles */}
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ left: p.x, top: p.y, background: "#fff", opacity: 0.5 }} />
      ))}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          padding: "0 2rem",
        }}
        className="items-center md:items-start"
      >
        {/* Content Wrapper */}
        <div
          className="ml-0 md:ml-10"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* MANOJ */}
          <h1
            className="typewriter-manoj"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(4rem, 10vw, 9rem)",
              lineHeight: 0.9,
              letterSpacing: "0.18em",
              color: "#ffffff",
              marginBottom: "0.02em",
              textAlign: "center",
              textShadow:
                "0 4px 20px rgba(0,0,0,0.65), 0 10px 40px rgba(0,0,0,0.45)",
            }}
          >
            MANOJ
          </h1>

          {/* YADAV */}
          <h1
            className="typewriter-yadav"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(4rem, 10vw, 9rem)",
              lineHeight: 0.9,
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "0.18em",
              textAlign: "center",
              textShadow:
                "0 4px 20px rgba(0,0,0,0.65), 0 10px 40px rgba(0,0,0,0.45)",
            }}
          >
            YADAV
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(0.75rem, 1.2vw, 1rem)",
              fontWeight: 300,
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.59)",
              textTransform: "uppercase",
              marginTop: "0.4rem",
              textAlign: "center",
              textShadow: "0 2px 12px rgba(0,0,0,0.35)",
              animation: "title-reveal 1.2s 2.5s both ease",
            }}
          >
            — LYRICS • POETRY • MUSIC —
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              gap: "1.2rem",
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "title-reveal 1s 1s both ease",
            }}
          ></div>

          {/* CTA Buttons */}
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              gap: "1.2rem",
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "title-reveal 1s 1s both ease",
            }}>
            <a
              href="#songs"
              className="btn-primary"
              style={{
                padding: "0.9rem 2.5rem",
                textDecoration: "none",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: "0.9rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#e1e5d9e0",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "999px",
                boxShadow: "0 4px 25px rgba(255,255,255,0.06)",
                transition: "all 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(255,255,255,0.22)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.boxShadow =
                  "0 4px 25px rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              Explore Songs
            </a>
            <a
              href="#contact"
              className="btn-primary"
              style={{
                padding: "0.9rem 2.5rem",
                textDecoration: "none",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: "0.9rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#f4faf5e0",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "999px",
                boxShadow: "0 4px 25px rgba(255,255,255,0.06)",
              }}>
              Get In Touch
            </a>
          </div>
        </div>
      </div>

      {/* FIX 1: Social FAB — controlled by fabOpen state, toggled only on button click */}
      <div className={`social-fab-wrap${fabOpen ? " active" : ""}`}>
        <div className="social-fab-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
            className="social-icon-btn" style={{ background: "#1877F2" }}
            onClick={e => e.stopPropagation()}>
            {/* Facebook */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
            className="social-icon-btn" style={{ background: "black" }}
            onClick={e => e.stopPropagation()}>
            {/* Twitter/X */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href="https://spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-btn"
            style={{ background: "#1DB954" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Spotify */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.372 0 0 5.373 0 12c0 6.627 5.372 12 12 12s12-5.373 12-12C24 5.373 18.628 0 12 0zm5.521 17.34a.748.748 0 0 1-1.03.247c-2.82-1.725-6.364-2.115-10.535-1.159a.75.75 0 1 1-.336-1.462c4.567-1.044 8.48-.604 11.655 1.337a.75.75 0 0 1 .246 1.037zm1.469-3.27a.938.938 0 0 1-1.288.308c-3.226-1.983-8.144-2.557-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM20.04 9.42C15.96 7.02 9.24 6.84 5.4 8.04c-.6.18-1.2-.12-1.38-.72-.18-.6.12-1.2.72-1.38 4.38-1.38 11.76-1.14 16.56 1.74.54.3 0.72.96.42 1.5-.3.54-1.02.72-1.68.24z" />
            </svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
            className="social-icon-btn"
            style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
            onClick={e => e.stopPropagation()}>
            {/* Instagram */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
        {/* FIX 1: Main FAB Button — onClick toggles fabOpen state, stopPropagation prevents hero click */}
        <button
          className="fab-main"
          aria-label="Social links"
          onClick={e => { e.stopPropagation(); setFabOpen(f => !f); }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      {/* MuddaScope bottom strip */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2,
        background: "linear-gradient(to top, rgba(10,6,8,0.95) 0%, rgba(10,6,8,0) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "1rem", display: "flex", alignItems: "center",
        justifyContent: "center", gap: "1rem", flexWrap: "wrap"
      }}>
        <a href="https://muddascope.com" target="_blank" rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            textDecoration: "none", padding: "0.5rem 1rem",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px",
            background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)",
            transition: "all 0.5s ease"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="10" fill="#FFFFFF" opacity="0.15" />
            <circle cx="20" cy="20" r="4" fill="#FFFFFF" />
            <line x1="20" y1="2" x2="20" y2="10" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="20" y1="30" x2="20" y2="38" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="2" y1="20" x2="10" y2="20" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="30" y1="20" x2="38" y2="20" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
          <span style={{ fontFamily: "'Cinzel Decorative'", fontSize: "0.85rem", color: "#fff", letterSpacing: "0.08em" }}>MuddaScope</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>↗</span>
        </a>
      </div>
    </section>
  );
};

// ── ABOUT ────────────────────────────────────────────────────────────────────
const AnimatedNumber = ({ target, suffix }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  // Trigger animation only when it scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return; // Wait until visible

    let startTimestamp = null;
    const duration = 2000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [target, hasAnimated]);

  // Using a span instead of a fragment so we can attach the ref for scroll detection
  return <span ref={ref}>{count}{suffix}</span>;
};

const About = () => {
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && e.target.classList.add("visible"),
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const statsData = [
    { target: 200, suffix: "+", label: "Songs & Jingles", link: "/songs" },
    { target: 50, suffix: "+", label: "Films", link: "/films" },
    { target: 11, suffix: "", label: "Awards", link: "#awards" }
  ];

  return (
    <section id="about" ref={ref} className="section-reveal section-pad" style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <div className="resp-grid">
        {/* Photo Section */}
        <div style={{ padding: "0 1rem" }}>
          <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>
            
            {/* Top-Left Light Golden Half Frame */}
            <div style={{ 
              position: "absolute", top: "-10px", left: "-10px", 
              width: "50px", height: "50px", 
              borderTop: "3px solid rgba(201,168,76,0.7)", 
              borderLeft: "3px solid rgba(201,168,76,0.7)", 
              zIndex: 2 
            }} />

            {/* Bottom-Right Light Golden Half Frame */}
            <div style={{ 
              position: "absolute", bottom: "-10px", right: "-10px", 
              width: "50px", height: "50px", 
              borderBottom: "3px solid rgba(201,168,76,0.7)", 
              borderRight: "3px solid rgba(201,168,76,0.7)", 
              zIndex: 2 
            }} />

            {/* Image Wrapper with Hover Zoom */}
            <div 
              style={{ 
                overflow: "hidden", position: "relative", zIndex: 1,
                boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 30px rgba(201,168,76,0.1)" 
              }}
              onMouseEnter={(e) => e.currentTarget.querySelector('img').style.transform = "scale(1.08)"}
              onMouseLeave={(e) => e.currentTarget.querySelector('img').style.transform = "scale(1)"}
            >
              <img src="about.jpeg" alt="Manoj Yadav" style={{
                width: "100%", aspectRatio: "3/4", objectFit: "cover",
                filter: "sepia(20%) contrast(1.05)",
                transition: "transform 0.5s ease",
                display: "block"
              }} />
            </div>
          </div>

          {/* Glowing YouTube Button */}
          <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "center" }}>
            <a 
              href="https://www.youtube.com/watch?v=-1ldiL6MuNo&t=374s" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "0.8rem 1.5rem", borderRadius: "50px",
                background: "rgba(255,0,0,0.08)",
                border: "1px solid rgba(255,0,0,0.4)",
                color: "#fff", textDecoration: "none",
                fontFamily: "'Playfair Display', serif", fontSize: "1.1rem",
                boxShadow: "0 0 15px rgba(255,0,0,0.5), inset 0 0 10px rgba(255,0,0,0.2)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 25px rgba(255,0,0,0.8), inset 0 0 15px rgba(255,0,0,0.4)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.background = "rgba(255,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 15px rgba(255,0,0,0.5), inset 0 0 10px rgba(255,0,0,0.2)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255,0,0,0.08)";
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff0000">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Watch my journey
            </a>
          </div>
        </div>

        {/* Text */}
        <div>
          <p style={{ color: "var(--gold)", fontSize: "0.8rem", letterSpacing: "0.4em", fontFamily: "'Cormorant Garamond'", textTransform: "uppercase", marginBottom: "1rem" }}>✦ About the Artist</p>
          <h2 style={{
            fontFamily: "'Playfair Display'", fontSize: "clamp(2rem, 8vw, 3.5rem)",
            color: "var(--parchment)", lineHeight: 1.2, marginBottom: "1.5rem",
            textShadow: "0 0 30px rgba(201,168,76,0.2)"
          }}>Crafting Words<br /><span style={{ fontStyle: "italic", color: "var(--gold)" }}>into Emotions</span></h2>
          <div style={{ width: "60px", height: "2px", background: "var(--gold)", marginBottom: "2rem" }} />
          <p style={{ color: "rgba(245,237,216,0.8)", lineHeight: 1.9, fontSize: "1.05rem", marginBottom: "1.5rem", fontWeight: 300 }}>
            Like many children, I grew up carrying my parents' dreams of becoming someone respected — a doctor, engineer, or teacher. But deep inside, I was drawn toward creativity and storytelling. Inspired by the legendary lyricist Gulzar, I discovered the power of words and began writing in my own unique style, even when people laughed at it. Life brought struggles, criticism, and loss, but I never let go of my belief in writing.
          </p>
          <p style={{ color: "rgba(245,237,216,0.7)", lineHeight: 1.9, fontSize: "1rem", marginBottom: "2rem", fontWeight: 300 }}>
            With persistence, self-confidence, and constant learning, I slowly found opportunities in jingles, films, and corporate projects. Today, I continue to create music and lyrics that reflect my individuality and emotions. My journey is proof that passion, patience, and belief in yourself can turn dreams into reality.
          </p>

          {/* Animated & Linked Stats Section */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {statsData.map(({ target, suffix, label, link }) => (
              <a
                href={link}
                key={label}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem 0.5rem",
                    border: "1px solid rgba(201,168,76,0.2)",
                    background: "rgba(201,168,76,0.04)",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                    height: "100%"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(201,168,76,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(201,168,76,0.04)"}
                >
                  <div className="shimmer-text" style={{ fontFamily: "'Bebas Neue'", fontSize: "clamp(1.8rem, 5vw, 2.5rem)", lineHeight: 1 }}>
                    <AnimatedNumber target={target} suffix={suffix} />
                  </div>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "rgba(245,237,216,0.5)", marginTop: "0.5rem", textTransform: "uppercase", fontFamily: "'Cormorant Garamond'" }}>
                    {label}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── SONGS ────────────────────────────────────────────────────────────────────
const Songs = () => {
  const trackRef = useRef();
  const canvasRef = useRef();
  const sectionRef = useRef();

  const state = useRef({
    current: 0,
    animating: false,
    autoTimer: null,
    isPlaying: false,
    autoStopped: false,
    slots: [],
    playingAudio: null,
    playingSong: null
  });

  const SONGS = [
    { title: "Hua Hain Aaj Pehli Baar", film: "Sanam Re", year: 2016, image: "/covers/s1.jpg", audio: "/songs/s1.mp3"},
    { title: "Teri Meri Kahaani", film: "Gabbar Is Back", year: 2015, image: "/covers/s2.jpg", audio: "/songs/s2.mp3"},
    { title: "Itni Si Baat Hain", film: "Azhar", year: 2016, image: "/covers/s3.jpg", audio: "/songs/s3.mp3"},
    { title: "Har Kisi Ko", film: "Boss", year: 2013, image: "/covers/s4.jpg", audio: "/songs/s4.mp3"},
    { title: "Saanson Ke", film: "Raees", year: 2016, image: "/covers/s5.jpg", audio: "/songs/s5.mp3"},
    { title: "Pyar Ki", film: "Housefull 3", year: 2016, image: "/covers/s6.jpg", audio: "/songs/s6.mp3"},
    { title: "Madari", film: "Coke Studio", year: 2012, image: "/covers/s7.jpg", audio: "/songs/s7.mp3"},
    { title: "Saheb Tu Sarkar Tu", film: "Thackeray", year: 2019, image: "/covers/s8.jpg", audio: "/songs/s8.mp3"},
  ];

  useEffect(() => {
    const track = trackRef.current;
    const canvas = canvasRef.current;
    const s = state.current;
    if (!track || !canvas) return;

    let currentIsMobile = window.innerWidth < 768;
    const getIsMobile = () => window.innerWidth < 768;
    const getCW = () => getIsMobile() ? 280 : 220;

    const updateNP = () => {
      const el = document.getElementById("sc-np");
      const ind = document.getElementById("sc-ind");
      if (!el || !ind) return;
      el.textContent = s.isPlaying && s.playingSong ? `${s.playingSong.title} — ${s.playingSong.film}` : "";
      ind.classList.toggle("sc-ind-active", s.isPlaying);
    };

    const updatePositions = (instant = false) => {
      const isMobile = getIsMobile();
      const CW = getCW();
      const N = SONGS.length;

      s.slots.forEach((card, i) => {
        let diff = i - s.current;
        if (diff > Math.floor(N / 2)) diff -= N;
        if (diff < -Math.floor(N / 2)) diff += N;

        let active = (diff === 0);
        let isSide = Math.abs(diff) === 1;
        let scale, ty, op, z, tx;

        if (isMobile) {
          tx = diff * (CW + 20);
          scale = active ? 1 : 0.8;
          ty = active ? -50 : -46;
          op = active ? 1 : 0;
          z = active ? 10 : 1;
        } else {
          tx = diff * (CW + 40);
          scale = active ? 1.08 : isSide ? 0.82 : 0.6;
          ty = active ? -50 : isSide ? -46 : -44;
          op = active ? 1 : isSide ? 0.45 : 0;
          z = active ? 10 : isSide ? 5 : 1;
        }

        card.style.transition = instant ? "none" : "transform .65s cubic-bezier(.32,1.1,.55,1), opacity .5s ease";
        card.style.transform = `translateX(calc(-50% + ${tx}px)) translateY(${ty}%) scale(${scale})`;
        card.style.opacity = op;
        card.style.zIndex = z;
        card.classList.toggle("sc-center", active);
      });
    };

    const makeCard = (song) => {
      const c = document.createElement("div");
      c.className = "sc-card";
      c.innerHTML = `
        <img src="${song.image}" alt="${song.title}" loading="lazy" />
        <audio class="sc-audio" src="${song.audio}" preload="metadata"></audio>
        <div class="sc-body">
          <div style="width: calc(100% - 50px);">
            <div class="sc-title">${song.title}</div>
            <div class="sc-film">${song.film}</div>
            <div class="sc-year">${song.year}</div>
          </div>
          <div class="sc-progress-wrapper" style="margin-top: .8rem; width: calc(100% - 55px);">
            <input type="range" class="sc-slider" min="0" max="100" value="0" step="0.1"
                    style="width:100%; height:4px; -webkit-appearance:none; appearance:none; background:rgba(255,255,255,.07); border-radius:2px; outline:none; margin: 0; display: block;" />
            <div style="display:flex; justify-content:space-between; font-size:0.65rem; color:rgba(201,168,76,.6); margin-top: 6px; font-family: sans-serif;">
              <span class="sc-time-curr">0:00</span>
              <span class="sc-time-dur">0:00</span>
            </div>
          </div>
        </div>
        <button class="sc-play" aria-label="Play ${song.title}">
          <svg class="sc-pi" width="20" height="20" viewBox="0 0 24 24" fill="#0A0608"><polygon points="5,3 19,12 5,21"/></svg>
          <svg class="sc-pa" width="20" height="20" viewBox="0 0 24 24" fill="#0A0608" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        </button>
      `;

      const audio = c.querySelector(".sc-audio");
      const btn = c.querySelector(".sc-play");
      const slider = c.querySelector(".sc-slider");
      const timeCurr = c.querySelector(".sc-time-curr");
      const timeDur = c.querySelector(".sc-time-dur");

      const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
      };

      const updateSliderVisual = (percent) => {
        slider.style.background = `linear-gradient(90deg, #C9A84C ${percent}%, rgba(255,255,255,.07) ${percent}%)`;
      };

      audio.addEventListener("loadedmetadata", () => {
        timeDur.textContent = formatTime(audio.duration);
      });

      audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
          const percent = (audio.currentTime / audio.duration) * 100;
          slider.value = percent;
          timeCurr.textContent = formatTime(audio.currentTime);
          updateSliderVisual(percent);
        }
      });

      slider.addEventListener("input", (e) => {
        if (audio.duration) {
          if (s.autoTimer) { clearInterval(s.autoTimer); s.autoTimer = null; }
          s.autoStopped = true;
          const percent = e.target.value;
          audio.currentTime = (percent / 100) * audio.duration;
          updateSliderVisual(percent);
        }
      });

      // FIX 3: Stop ALL pointer events on slider from bubbling to the swipe handler
      const stopProp = (e) => e.stopPropagation();
      slider.addEventListener("touchstart", stopProp, { passive: true });
      slider.addEventListener("touchmove", stopProp, { passive: true });
      slider.addEventListener("touchend", stopProp, { passive: true });
      slider.addEventListener("mousedown", stopProp);
      slider.addEventListener("mouseup", stopProp); // FIX 3: Added — prevents swipe firing on slider release
      slider.addEventListener("click", stopProp);

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!c.classList.contains("sc-center")) return;

        if (s.autoTimer) { clearInterval(s.autoTimer); s.autoTimer = null; }
        s.autoStopped = true;

        if (s.playingAudio === audio && !audio.paused) {
          audio.pause();
          s.isPlaying = false;
          btn.querySelector(".sc-pi").style.display = "";
          btn.querySelector(".sc-pa").style.display = "none";
        } else {
          document.querySelectorAll(".sc-audio").forEach(a => a.pause());
          document.querySelectorAll(".sc-play .sc-pi").forEach(i => i.style.display = "");
          document.querySelectorAll(".sc-play .sc-pa").forEach(i => i.style.display = "none");

          audio.play();
          s.isPlaying = true;
          s.playingAudio = audio;
          s.playingSong = song;
          btn.querySelector(".sc-pi").style.display = "none";
          btn.querySelector(".sc-pa").style.display = "";
        }
        updateNP();
      });

      audio.addEventListener("ended", () => {
        if (s.playingAudio === audio) s.isPlaying = false;
        btn.querySelector(".sc-pi").style.display = "";
        btn.querySelector(".sc-pa").style.display = "none";
        slider.value = 0;
        timeCurr.textContent = "0:00";
        updateSliderVisual(0);
        updateNP();
      });

      return c;
    };

    const slide = (dir) => {
      if (s.animating) return;
      s.animating = true;
      s.current = (s.current + dir + SONGS.length) % SONGS.length;
      updatePositions(false);
      document.querySelectorAll(".sc-dot").forEach((d, i) => d.classList.toggle("sc-dot-active", i === s.current));
      setTimeout(() => { s.animating = false; }, 650);
    };

    const initCarousel = () => {
      track.innerHTML = '';
      s.slots = [];
      SONGS.forEach((song) => {
        const c = makeCard(song);
        track.appendChild(c);
        s.slots.push(c);
      });
      updatePositions(true);
    };

    initCarousel();

    // Swipe Mechanics
    let touchStartX = 0;
    let touchEndX = 0;
    let isDraggingSlider = false;

    const handleSwipe = () => {
      // FIX 3: Don't swipe if the interaction started on the slider
      if (isDraggingSlider) { isDraggingSlider = false; return; }
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (s.autoTimer) { clearInterval(s.autoTimer); s.autoTimer = null; }
        s.autoStopped = true;
        diff > 0 ? slide(1) : slide(-1);
      }
    };

    track.addEventListener('touchstart', (e) => {
      // FIX 3: Check if touch started on a slider element
      if (e.target.classList.contains('sc-slider')) { isDraggingSlider = true; return; }
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (isDraggingSlider) { isDraggingSlider = false; return; }
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    track.addEventListener('mousedown', (e) => {
      // FIX 3: Check if mousedown started on a slider element
      if (e.target.classList.contains('sc-slider')) return;
      touchStartX = e.screenX;
    });
    track.addEventListener('mouseup', (e) => {
      // FIX 3: Check if mouseup is on a slider element
      if (e.target.classList.contains('sc-slider')) return;
      touchEndX = e.screenX;
      handleSwipe();
    });

    document.getElementById("sc-prev")?.addEventListener("click", () => { if (s.autoTimer) { clearInterval(s.autoTimer); s.autoTimer = null; } s.autoStopped = true; slide(-1); });
    document.getElementById("sc-next")?.addEventListener("click", () => { if (s.autoTimer) { clearInterval(s.autoTimer); s.autoTimer = null; } s.autoStopped = true; slide(1); });

    s.autoTimer = setInterval(() => { if (!s.autoStopped) slide(1); }, 2400);

    const ctx = canvas.getContext("2d");

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== currentIsMobile) {
        currentIsMobile = newIsMobile;
      }
      if (s.slots.length > 0) updatePositions(true);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const N = 48;
    const bars = Array.from({ length: N }, () => ({ h: Math.random() * 50 + 10, spd: Math.random() * .07 + .02, ph: Math.random() * Math.PI * 2 }));
    let t = 0, raf;

    const draw = () => {
      const W = canvas.width, H = canvas.height, bw = W / N;
      ctx.clearRect(0, 0, W, H);
      bars.forEach((b, i) => {
        b.h = Math.max(8, Math.min(90, b.h + Math.sin(t * b.spd * 3 + b.ph) * (s.isPlaying ? 2.5 : 1.2)));
        const alpha = s.isPlaying ? (0.18 + 0.12 * Math.sin(t * .05 + i * .25)) : (0.08 + 0.04 * Math.sin(t * .03 + i * .3));
        ctx.fillStyle = `rgba(201,168,76,${alpha})`;
        ctx.fillRect(i * bw + bw * .18, H - b.h, bw * .64, b.h);
        ctx.fillRect(i * bw + bw * .18, 0, bw * .64, b.h * .3);
      });
      t++;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      if (s.autoTimer) clearInterval(s.autoTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && e.target.classList.add("visible"), { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="songs" ref={sectionRef} className="section-reveal"
      style={{ padding: "6rem 0 4rem", background: "rgba(255,255,255,0.01)", overflow: "hidden" }}>
      <style>{`
        .sc-card { position:absolute; left: 50%; width:280px; border-radius:16px; overflow:hidden; top:50%; pointer-events:none; will-change:transform,opacity; border:1px solid rgba(201,168,76,.15); box-shadow:0 12px 40px rgba(0,0,0,.6); cursor: grab; }
        .sc-card:active { cursor: grabbing; }
        @media (min-width: 768px) {
          .sc-card { width: 220px; }
        }
        .sc-card img{width:100%;height:220px;object-fit:cover;display:block;filter:brightness(.8)}
        .sc-body{padding:1rem 1.1rem 1.1rem;background:#180e0e;position:relative;}
        .sc-title{font-family:'Playfair Display',serif;font-style:italic;font-size:1.05rem;color:#F5EDD8;margin-bottom:.3rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; white-space: normal; line-height: 1.2;}
        .sc-film{font-size:.8rem;color:rgba(201,168,76,.8);letter-spacing:.1em; white-space: normal;}
        .sc-year{font-size:.72rem;color:rgba(245,237,216,.3);margin-top:.3rem}
        .sc-center .sc-play, .sc-center .sc-progress-wrapper { pointer-events: auto; }
        .sc-slider { touch-action: none; }
        .sc-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #F0D080; cursor: pointer; box-shadow: 0 0 5px rgba(0,0,0,0.5); }
        .sc-slider::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #F0D080; cursor: pointer; border: none; box-shadow: 0 0 5px rgba(0,0,0,0.5); }
        .sc-play{position:absolute;bottom:1.1rem;right:1.1rem;width:48px;height:48px;border-radius:50%;background:#C9A84C;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.7);transition:opacity .3s,transform .3s;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,.5);z-index:20}
        .sc-center .sc-play{opacity:1;transform:scale(1);}
        .sc-play:hover{transform:scale(1.1)!important;background:#F0D080}
        .sc-dot{width:7px;height:7px;border-radius:50%;background:rgba(201,168,76,.2);transition:all .35s;cursor:pointer}
        .sc-dot-active{background:#C9A84C;transform:scale(1.5)}
        .sc-ind-active span{animation:sc-bounce .8s ease-in-out infinite}
        @keyframes sc-bounce{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1)}}
        .spotify-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: #1DB954;
          color: #000;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          text-decoration: none;
          padding: 14px 36px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 6px 20px rgba(29, 185, 84, 0.3);
          z-index: 20;
        }
        .spotify-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 50px;
          background: linear-gradient(45deg, #1ed760, #1DB954);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .spotify-pulse {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 50px;
          z-index: -2;
          box-shadow: 0 0 0 0 rgba(29, 185, 84, 0.6);
          animation: sp-pulse 2.5s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        @keyframes sp-pulse {
          0% { box-shadow: 0 0 0 0 rgba(29, 185, 84, 0.5); }
          70% { box-shadow: 0 0 0 20px rgba(29, 185, 84, 0); }
          100% { box-shadow: 0 0 0 0 rgba(29, 185, 84, 0); }
        }
        .spotify-btn:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 10px 25px rgba(29, 185, 84, 0.5);
          color: #000;
        }
        .spotify-btn:hover::before { opacity: 1; }
        .spotify-btn svg { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .spotify-btn:hover svg { transform: scale(1.15) rotate(8deg); }
      `}
      </style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <SectionHeading top="Discography" main="Songs &" accent="Lyrics" />
      </div>

      <div style={{ position: "relative", marginTop: "2.5rem" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6, pointerEvents: "none" }} />
        <div ref={trackRef} style={{ position: "relative", height: "380px" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "1.2rem", position: "relative", zIndex: 10, flexWrap: "wrap" }}>
        <button id="sc-prev" style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A84C" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ display: "flex", gap: 8, margin: "0 0.5rem" }}>
          {SONGS.map((_, i) => <div key={i} className={`sc-dot${i === 0 ? " sc-dot-active" : ""}`} />)}
        </div>
        <button id="sc-next" style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A84C" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.78rem", letterSpacing: "0.15em", color: "rgba(201,168,76,.55)", fontFamily: "'Cormorant Garamond',serif", textTransform: "uppercase", minHeight: "1.5em", padding: "0 1rem" }}>
        <span id="sc-ind" style={{ display: "inline-flex", alignItems: "flex-end", gap: 3, height: 14, marginRight: 8, verticalAlign: "middle" }}>
          {[0,1,2,3].map(i => <span key={i} style={{ display: "inline-block", width: 3, borderRadius: 2, background: "#C9A84C", height: [6,12,8,14][i], animationDelay: `${[0,.15,.3,.1][i]}s` }} />)}
        </span>
        <span id="sc-np"></span>
      </div>

      {/* Spotify Button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "3.5rem", position: "relative", zIndex: 15 }}>
        <a href="https://open.spotify.com/artist/0qSfAhYhb7KWEuiLuooBaE" target="_blank" rel="noopener noreferrer" className="spotify-btn">
          <span className="spotify-pulse"></span>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM20.04 9.42C15.96 7.02 9.24 6.84 5.4 8.04c-.6.18-1.2-.12-1.38-.72-.18-.6.12-1.2.72-1.38 4.38-1.38 11.76-1.14 16.56 1.74.54.3 0.72.96.42 1.5-.3.54-1.02.72-1.68.24z"/>
          </svg>
          Listen More on Spotify
        </a>
      </div>
    </section>
  );
};

// ── JINGLES ──────────────────────────────────────────────────────────────────
const jingles = [
  { brand: "Taj Mahal Tea", year: 2010, desc: "Wah Taj! — the iconic verse that redefined brand poetry." },
  { brand: "Mirinda", year: 2013, desc: "Pagalpanti se filled — a playful hook that stuck for a decade." },
  { brand: "Amul", year: 2015, desc: "Utterly Butterly Delicious — a reimagined lyrical version." },
  { brand: "Fevicol", year: 2017, desc: "Jodo dil se — emotional bonding brought to life in verse." },
  { brand: "Thums Up", year: 2019, desc: "Toofani — adrenaline in every syllable." },
  { brand: "Bisleri", year: 2021, desc: "Pani ki pyaas — a meditative ode to life's simplest element." },
];

const Jingles = () => {
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && e.target.classList.add("visible"), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="jingles" ref={ref} className="section-reveal section-pad">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeading top="Commercial Work" main="Jingles &" accent="Brand Verse" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem", marginTop: "3rem" }}>
          {jingles.map((j, i) => (
            <div key={j.brand} style={{
              padding: "2rem", border: "1px solid rgba(201,168,76,0.15)",
              background: "linear-gradient(135deg, rgba(201,168,76,0.04), rgba(10,6,8,0.8))",
              position: "relative", overflow: "hidden", transition: "all 0.4s ease"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(201,168,76,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ position: "absolute", top: "-0.5rem", right: "1rem", fontFamily: "'Bebas Neue'", fontSize: "5rem", color: "rgba(201,168,76,0.05)", userSelect: "none", lineHeight: 1 }}>0{i + 1}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "1rem" }}>♪</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display'", fontSize: "1.1rem", color: "var(--parchment)" }}>{j.brand}</h3>
                  <span style={{ fontSize: "0.7rem", color: "var(--gold)", letterSpacing: "0.2em" }}>{j.year}</span>
                </div>
              </div>
              <p style={{ color: "rgba(245,237,216,0.65)", fontSize: "0.9rem", lineHeight: 1.7, fontStyle: "italic", fontFamily: "'Cormorant Garamond'" }}>{j.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── AWARDS ───────────────────────────────────────────────────────────────────


// Replaced placeholder seeds with local image paths for you to add your own photos
const awards = [
  { title: "Filmfare Awards", category: "Best Lyrics", year: "2009", info: "Celebrating timeless lyrical brilliance in Indian cinema.", image: "/images/a1.jpeg" },
  { title: "National Film", category: "National Honour", year: "2015", info: "Recognised for soulful poetry and cinematic storytelling.", image: "/images/a2.jpeg" },
  { title: "IIFA Awards", category: "International", year: "2018", info: "Global recognition for emotionally rich songwriting.", image: "/images/a3.jpeg" },
  { title: "Mirchi Music", category: "Listeners' Choice", year: "2019", info: "Awarded for the most streamed song of the year.", image: "/images/a4.jpeg" },
  { title: "Screen Awards", category: "Best Soundtrack", year: "2020", info: "Honored for outstanding contribution to the film's musical narrative.", image: "/images/a5.jpeg" },
  { title: "Zee Cine", category: "Best Lyricist", year: "2021", info: "Jury's choice for exceptional lyrical depth.", image: "/images/a6.jpeg" },
  { title: "GIMA Awards", category: "Best Indie Song", year: "2022", info: "Recognized in the independent music category.", image: "/images/a7.jpeg" },
  { title: "Stardust Awards", category: "Standout Lyrics", year: "2022", info: "Voted by readers for the most impactful words.", image: "/images/a8.jpeg" },
  { title: "Radio City", category: "Top Airplay", year: "2023", info: "The most played song across national radio stations.", image: "/images/a9.jpeg" },
  { title: "Filmfare OTT", category: "Best Web Lyrics", year: "2023", info: "Excellence in songwriting for digital streaming platforms.", image: "/images/a10.jpeg" },
  { title: "Global Indian", category: "Lifetime Impact", year: "2024", info: "A special honor for a decade of musical excellence.", image: "/images/a11.jpeg" },
];

const Awards = () => {
  const [selected, setSelected] = useState(null);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && e.target.classList.add("visible"), 
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="awards" ref={ref} className="section-reveal section-pad" style={{ background: "radial-gradient(circle at top, rgba(201,168,76,0.08), transparent 60%)", overflow: "hidden" }}>
      
      <div style={{ maxWidth: "1350px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.85rem" }}>Recognition</p>
          <h2 style={{ color: "#fff", fontSize: "3rem", fontFamily: "'Playfair Display'" }}>Awards & <span style={{ color: "var(--gold)", fontStyle: "italic" }}>Honours</span></h2>
        </div>

        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "center", 
          gap: "1.25rem", 
          marginTop: "2rem" 
        }}>
          {awards.map((a, i) => (
            <div 
              key={a.title} 
              onClick={() => setSelected(a)} 
              style={{
                position: "relative", 
                overflow: "hidden", 
                borderRadius: "14px",
                cursor: "pointer", 
                width: "195px", 
                height: "280px", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                transition: "all 0.4s ease",
                animation: `award-pop 0.6s ${i * 0.1}s both ease`,
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.transform = "translateY(-6px)"; 
                e.currentTarget.style.boxShadow = "0 20px 45px rgba(201,168,76,0.35)"; 
                const overlay = e.currentTarget.querySelector('.award-info-overlay');
                if(overlay) {
                  overlay.style.opacity = "1";
                  overlay.style.transform = "translateY(0)";
                }
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.transform = "translateY(0)"; 
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)"; 
                const overlay = e.currentTarget.querySelector('.award-info-overlay');
                if(overlay) {
                  overlay.style.opacity = "0";
                  overlay.style.transform = "translateY(15px)";
                }
              }}
            >
              <img 
                src={a.image} 
                alt={a.title} 
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9)" }} 
              />
              
              <div 
                className="award-info-overlay"
                style={{ 
                  position: "absolute", 
                  inset: 0, 
                  background: "linear-gradient(to top, rgba(201,168,76,0.98) 0%, rgba(201,168,76,0.6) 45%, transparent 100%)", 
                  display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center",
                  padding: "1.5rem 1rem", textAlign: "center",
                  opacity: 0, 
                  transform: "translateY(15px)", 
                  transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
              >
                <h3 style={{ margin: 0, color: "#111", fontFamily: "'Playfair Display'", fontSize: "1.2rem", fontWeight: "900", lineHeight: 1.1, textShadow: "0px 1px 10px rgba(255,255,255,0.3)" }}>
                  {a.title}
                </h3>
                <p style={{ margin: "0.5rem 0", color: "#000", fontSize: "0.9rem", fontWeight: "bold", letterSpacing: "0.15em" }}>
                  {a.year}
                </p>
                <p style={{ margin: 0, color: "#222", fontSize: "0.75rem", fontFamily: "'Cormorant Garamond'", textTransform: "uppercase", fontWeight: "800" }}>
                  {a.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Larger View Modal (Responsive PC/Mobile) */}
      {selected && (
        <div 
          onClick={() => setSelected(null)} 
          style={{
            position: "fixed", inset: 0, zIndex: 9999, 
            background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)", 
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem"
          }}
        >
          <div 
            onClick={e => e.stopPropagation()} 
            style={{
              width: "100%", maxWidth: "900px", /* Increased width for PC */
              maxHeight: "90vh", /* Prevents jumping, forces internal scroll on tiny screens */
              overflowY: "auto", 
              borderRadius: "18px", 
              background: "#0a0a0a", border: "1px solid rgba(201,168,76,0.4)",
              boxShadow: "0 0 60px rgba(201,168,76,0.25), 0 30px 60px rgba(0,0,0,0.9)",
              animation: "award-pop 0.3s ease-out", 
              display: "flex", 
              flexWrap: "wrap", /* This pushes the text below the image on mobile */
              flexDirection: "row"
            }}
          >
            {/* Image Side (Left on PC, Top on Mobile) */}
            <div style={{ flex: "1 1 350px", position: "relative", minHeight: "350px" }}>
              <img 
                src={selected.image} 
                alt={selected.title} 
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
              />
              <button 
                onClick={() => setSelected(null)}
                style={{
                  position: "absolute", top: "1.2rem", left: "1.2rem", /* Moved to left so it's always on the photo */
                  background: "rgba(0,0,0,0.65)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
                  width: "38px", height: "38px", borderRadius: "50%",
                  cursor: "pointer", fontSize: "1.3rem", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(201,168,76,0.8)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.65)"}
              >
                &times;
              </button>
            </div>

            {/* Information Side (Right on PC, Bottom on Mobile) */}
            <div style={{ 
              flex: "1 1 350px", 
              padding: "2.5rem 2rem", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "center",
              textAlign: "center" 
            }}>
              <p style={{ color: "var(--gold)", letterSpacing: "0.25em", textTransform: "uppercase", fontSize: "0.85rem", fontFamily: "'Cormorant Garamond'", marginBottom: "0.6rem", fontWeight: "600" }}>
                {selected.year} • {selected.category}
              </p>
              <h2 style={{ color: "var(--parchment)", fontFamily: "'Playfair Display'", fontSize: "2.4rem", margin: "0 0 1.2rem 0" }}>
                {selected.title}
              </h2>
              <div style={{ width: "50px", height: "2px", background: "var(--gold)", margin: "0 auto 1.5rem auto", opacity: "0.6" }} />
              <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7, fontSize: "1.05rem", margin: 0, fontWeight: "300" }}>
                {selected.info}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};



// ── GALLERY ──────────────────────────────────────────────────────────────────
const galleryData = [
  { id: 1, src: "/images/g1.jpeg" },
  { id: 2, src: "/images/g2.jpeg" },
  { id: 3, src: "/images/g3.jpeg" },
  { id: 4, src: "/images/g4.jpeg" },
  { id: 5, src: "/images/g5.jpeg" },
  { id: 6, src: "/images/g6.jpeg" },
  { id: 7, src: "/images/g7.jpeg" },
  { id: 8, src: "/images/g8.jpeg" },
  { id: 9, src: "/images/g9.jpeg" },
  { id: 10, src: "/images/g10.jpeg" },
  { id: 11, src: "/images/g11.jpeg" },
  { id: 12, src: "/images/g12.jpeg" },
  { id: 13, src: "/images/g13.jpeg" },
  { id: 14, src: "/images/g14.jpeg" },
  { id: 15, src: "/images/g15.jpeg" },
  { id: 16, src: "/images/g16.jpeg" },
  { id: 17, src: "/images/g17.jpeg" },
  { id: 18, src: "/images/g18.jpeg" },
  { id: 19, src: "/images/g19.jpeg" },
  { id: 20, src: "/images/g20.jpeg" },
  { id: 21, src: "/images/g21.jpeg" },
  { id: 22, src: "/images/g22.jpeg" },
  { id: 23, src: "/images/g23.jpeg" },
  { id: 24, src: "/images/g24.jpeg" },
];

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const autoPlayRef = useRef();

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev === galleryData.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? galleryData.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(nextSlide, 3500);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [nextSlide, isPaused]);

  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    // FIX 2: Added id="gallery" so the nav "Gallery" link scrolls correctly
    <section id="gallery" className="w-full py-24 bg-black overflow-hidden flex flex-col items-center">

      {/* Heading */}
      <div className="mb-12 w-full" style={{ maxWidth: "1200px", margin: "0 auto 3rem auto", padding: "0 1.5rem" }}>
        <SectionHeading top="Moments" main="Gallery &" accent="Memories" />
      </div>

      {/* 3D Carousel Container */}
      <div
        className="relative w-full max-w-6xl h-[300px] md:h-[500px] flex justify-center items-center touch-pan-y"
        style={{ perspective: "1200px" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {galleryData.map((item, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);

          if (absOffset > 2) return null;

          let transformStyle = "";
          let zIndex = 20 - absOffset;
          let opacity = 1;

          if (offset === 0) {
            transformStyle = "translateX(0) scale(1) rotateY(0deg)";
          } else if (offset === -1) {
            transformStyle = "translateX(-65%) scale(0.8) rotateY(35deg)";
          } else if (offset === 1) {
            transformStyle = "translateX(65%) scale(0.8) rotateY(-35deg)";
          } else if (offset === -2) {
            transformStyle = "translateX(-100%) scale(0.6) rotateY(45deg)";
            opacity = 0;
          } else if (offset === 2) {
            transformStyle = "translateX(100%) scale(0.6) rotateY(-45deg)";
            opacity = 0;
          }

          return (
            <div
              key={item.id}
              onClick={() => offset === 0 ? setLightboxImg(item) : setActiveIndex(index)}
              className="absolute transition-all duration-700 ease-out"
              style={{
                transform: transformStyle,
                zIndex: zIndex,
                opacity: opacity,
                pointerEvents: opacity === 0 ? "none" : "auto",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`w-[260px] h-[180px] md:w-[480px] md:h-[320px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
                  offset === 0 ? "cursor-zoom-in" : "cursor-pointer brightness-50 hover:brightness-75"
                }`}
              >
                <img
                  src={item.src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out transition-opacity"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative w-full max-w-5xl max-h-[90vh] flex justify-center items-center">
            <button
              className="absolute -top-12 right-0 md:top-4 md:-right-12 text-white/70 hover:text-white text-4xl font-light transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImg(null);
              }}
            >
              &times;
            </button>
            <img
              src={lightboxImg.src}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
};

// ── CONTACT ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const ref = useRef();
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && e.target.classList.add("visible"), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const socials = [
    {
      label: "Twitter",
      handle: "@manojkikalam",
      href: "https://x.com/manojkikalam?lang=en",
      bg: "linear-gradient(135deg, #111111, #000000)",
      hover: "linear-gradient(135deg, #1f1f1f, #000000)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      label: "Instagram",
      handle: "@manojyadavwrites",
      href: "https://www.instagram.com/manojyadavwrites/",
      bg: "linear-gradient(135deg, #833AB4, #FD1D1D, #FCAF45)",
      hover: "linear-gradient(135deg, #9c4dcc, #ff2e63, #ffb347)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5C18.321 4 20 5.679 20 7.75v8.5C20 18.321 18.321 20 16.25 20h-8.5C5.679 20 4 18.321 4 16.25v-8.5C4 5.679 5.679 4 7.75 4zm8.75 1a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
        </svg>
      )
    },
    {
      label: "Facebook",
      handle: "Manoj Yadav",
      href: "https://www.facebook.com/ManojYadavOfficial/",
      bg: "linear-gradient(135deg, #1877F2, #0d5fd3)",
      hover: "linear-gradient(135deg, #2d88ff, #1877F2)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/>
        </svg>
      )
    },
    {
      label: "YouTube",
      handle: "Manoj Yadav Official",
      href: "https://youtube.com",
      bg: "linear-gradient(135deg, #FF0000, #cc0000)",
      hover: "linear-gradient(135deg, #ff1a1a, #ff4d4d)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a2.998 2.998 0 00-2.11-2.12C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.388.566a2.998 2.998 0 00-2.11 2.12C0 8.07 0 12 0 12s0 3.93.502 5.814a2.998 2.998 0 002.11 2.12C4.495 20.5 12 20.5 12 20.5s7.505 0 9.388-.566a2.998 2.998 0 002.11-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z"/>
        </svg>
      )
    }
  ];

  return (
    <section id="contact" ref={ref} className="section-reveal section-pad" style={{ background: "rgba(201,168,76,0.02)", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        fontFamily: "'Cinzel Decorative'", fontSize: "clamp(4rem, 15vw, 12rem)",
        color: "rgba(201,168,76,0.025)", whiteSpace: "nowrap", userSelect: "none", zIndex: 0
      }}>CONNECT</div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionHeading top="Reach Out" main="Connect with" accent="Manoj" />

        <div
          style={{
            textAlign: "center",
            margin: "2rem auto 3rem",
            maxWidth: "700px",
            padding: "1.5rem",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "1.5rem",
            background:
              "linear-gradient(145deg, rgba(20,20,20,0.92), rgba(45,45,45,0.78), rgba(15,15,15,0.95))",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.04)",
            transition: "all 0.45s ease",
            cursor: "pointer",
            overflow: "hidden"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.background =
              "linear-gradient(145deg, rgba(40,40,40,0.98), rgba(90,90,90,0.65), rgba(18,18,18,1))";
            e.currentTarget.style.boxShadow =
              "0 15px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.08)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background =
              "linear-gradient(145deg, rgba(20,20,20,0.92), rgba(45,45,45,0.78), rgba(15,15,15,0.95))";
            e.currentTarget.style.boxShadow =
              "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.04)";
          }}
        >
          <p style={{ fontFamily: "'Playfair Display'", fontSize: "clamp(1rem, 4vw, 1.3rem)", fontStyle: "italic", color: "rgba(245,237,216,0.8)", lineHeight: 1.7 }}>
            "समझा नहीं पाया हैसियत अपनी वो शायर,—<br />
            <span style={{ color: "var(--gold)" }}>किताब की कीमत आख़िरी पन्ने पर लिखी थी।"</span>
          </p>
        </div>

        <div className="resp-grid-start">
          <div>
            <h3 style={{ fontFamily: "'Playfair Display'", fontSize: "1.4rem", color: "var(--parchment)", marginBottom: "1.5rem", fontStyle: "italic" }}>Connect Online</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    borderRadius: "1rem",
                    border: "1px solid rgba(161, 42, 42, 0.08)",
                    background: "hsla(334, 78%, 2%, 0.55)",
                    textDecoration: "none",
                    transition: "all 0.4s ease",
                    overflow: "hidden"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = s.bg;
                    e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(10,6,8,0.55)";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: s.bg,
                      color: "#fff",
                      flexShrink: 0
                    }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.65)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontFamily: "'Bebas Neue', sans-serif"
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        color: "#fff",
                        fontFamily: "'Cormorant Garamond'",
                        fontSize: "1rem"
                      }}
                    >
                      {s.handle}
                    </div>
                  </div>
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "#fff",
                      opacity: 0.7,
                      fontSize: "1.2rem"
                    }}
                  >
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontFamily: "'Playfair Display'", fontSize: "1.4rem", color: "var(--parchment)", marginBottom: "1.5rem", fontStyle: "italic" }}>Send a Message</h3>
            {sent ? (
              <div style={{ padding: "2rem", textAlign: "center", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.05)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✦</div>
                <p style={{ fontFamily: "'Playfair Display'", fontSize: "1.2rem", color: "var(--gold)", fontStyle: "italic" }}>Message Sent!</p>
                <p style={{ color: "rgba(245,237,216,0.6)", marginTop: "0.5rem", fontFamily: "'Cormorant Garamond'" }}>"Message Sent Successfully."</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[{ label: "Your Name", type: "text" }, { label: "Email Address", type: "email" }].map(f => (
                  <input key={f.label} type={f.type} placeholder={f.label} style={{
                    width: "100%", padding: "0.85rem 1rem",
                    background: "rgba(10,6,8,0.6)", border: "1px solid rgba(201,168,76,0.2)",
                    color: "var(--parchment)", fontFamily: "'Cormorant Garamond'", fontSize: "1rem", outline: "none", borderRadius: "50px"
                  }} />
                ))}
                <textarea rows={4} placeholder="Your Message..." style={{
                  width: "100%", padding: "0.85rem 1rem",
                  background: "rgba(10,6,8,0.6)", border: "1px solid rgba(201,168,76,0.2)",
                  color: "var(--parchment)", fontFamily: "'Cormorant Garamond'", fontSize: "1rem", outline: "none", resize: "none", borderRadius: "20px"
                }} />
                <button onClick={() => setSent(true)} style={{
                  padding: "0.9rem 2rem", background: "var(--gold)", border: "none",
                  color: "var(--ink)", fontFamily: "'Cormorant Garamond'", fontSize: "0.9rem",
                  letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer",
                  transition: "opacity 0.3s ease", borderRadius: "50px"
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >Send Message</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <>
    <footer
      style={{
        background: "#0b0507",
        padding: "4rem 1.5rem 3rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Glow Background */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)",
          zIndex: 0
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Logo Heading */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "2rem"
          }}
        >
          <div style={{ width: "45px", height: "1px", background: "rgba(255,255,255,0.2)" }} />
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.5rem",
              letterSpacing: "0.2em",
              color: "#fff"
            }}
          >
            MANOJ YADAV
          </span>
          <div style={{ width: "45px", height: "1px", background: "rgba(255,255,255,0.2)" }} />
        </div>

        {/* Location */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'Cormorant Garamond'",
            fontSize: "1rem"
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/>
          </svg>
          Mumbai, India
        </div>

        {/* Copyright */}
        <p
          style={{
            color: "rgba(255,255,255,0.28)",
            fontSize: "0.78rem",
            fontFamily: "'Cormorant Garamond'",
            letterSpacing: "0.14em",
            marginBottom: "0.9rem"
          }}
        >
          © 2026 Manoj Yadav — Lyricist. All rights reserved.
        </p>

        {/* Made with Love */}
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.85rem",
            fontFamily: "'Cormorant Garamond'",
            letterSpacing: "0.1em"
          }}
        >
          Made with ❤️ for poetry & music
        </p>
      </div>
    </footer>
  </>
);

// ── Section Heading ───────────────────────────────────────────────────────────
const SectionHeading = ({ top, main, accent }) => (
  <div style={{ textAlign: "center" }}>
    <p style={{ color: "rgba(201,168,76,0.6)", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "'Cormorant Garamond'", marginBottom: "0.75rem" }}>✦ {top} ✦</p>
    <h2 style={{ fontFamily: "'Playfair Display'", fontSize: "clamp(2rem, 8vw, 4rem)", color: "var(--parchment)", lineHeight: 1.1 }}>
      {main} <span style={{ fontStyle: "italic", color: "var(--gold)" }}>{accent}</span>
    </h2>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
      <div style={{ width: "30px", height: "1px", background: "linear-gradient(to right, transparent, var(--gold))" }} />
      <div style={{ width: "6px", height: "6px", background: "var(--gold)", transform: "rotate(45deg)" }} />
      <div style={{ width: "30px", height: "1px", background: "linear-gradient(to left, transparent, var(--gold))" }} />
    </div>
  </div>
);

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <FontLink />
      <Nav />
      <Hero />
      <About />
      <Songs />
      <Jingles />
      <Awards />
      <Gallery />
      <Contact />
      <Footer />
    </>
  );
}