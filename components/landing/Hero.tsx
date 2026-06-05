export function Hero() {
  return (
    <section className="container" style={{ padding: "72px 0 48px" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 72 }}>
        <strong style={{ letterSpacing: "-0.04em", fontSize: 22 }}>RepoPilot</strong>
        <a href="/about" style={{ color: "var(--muted)" }}>About</a>
      </nav>
      <div style={{ maxWidth: 900 }}>
        <span className="badge">Navigate Any Open Source Repository in Minutes</span>
        <h1 style={{ fontSize: "clamp(48px, 8vw, 96px)", lineHeight: 0.95, letterSpacing: "-0.075em", margin: "24px 0" }}>
          Contributor onboarding for any GitHub repository.
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 22, lineHeight: 1.6, maxWidth: 760 }}>
          Paste a repository URL and get the essential Phase 1 context contributors need: repository
          metadata, languages, README preview, and beginner-friendly open issues.
        </p>
        <form action="/analyze" style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <input
            aria-label="GitHub repository URL"
            name="repo"
            placeholder="https://github.com/vercel/next.js"
            style={{ flex: "1 1 360px", minWidth: 0, padding: "16px 18px", borderRadius: 14, border: "1px solid var(--border)", background: "rgba(15, 23, 42, 0.8)", color: "var(--text)" }}
          />
          <button style={{ padding: "16px 22px", borderRadius: 14, border: 0, background: "linear-gradient(135deg, var(--accent), var(--accent-2))", color: "white", cursor: "pointer", fontWeight: 700 }}>
            Analyze repository
          </button>
        </form>
      </div>
    </section>
  );
}
