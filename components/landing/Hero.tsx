export function Hero() {
  return (
    <section className="hero container">
      <div className="hero-grid">
        <div>
          <span className="badge">Navigate any open source repository in minutes</span>
          <h1 className="page-heading">Contributor onboarding for public GitHub repositories.</h1>
          <p className="hero-copy">
            Paste a repository URL to review metadata, languages, README context, open issues, and optional AI
            contribution entry points grounded in verified repository evidence.
          </p>
          <form id="analyze-repository" action="/analyze" className="hero-form">
            <label className="form-field" style={{ flex: "1 1 360px" }}>
              <span className="field-label">GitHub repository URL</span>
              <input className="input" aria-label="GitHub repository URL" name="repo" placeholder="https://github.com/vercel/next.js" />
            </label>
            <button className="btn btn-primary" style={{ alignSelf: "end" }}>Analyze repository</button>
          </form>
          <div className="action-toolbar" style={{ justifyContent: "flex-start", marginTop: 14 }}>
            <a className="btn btn-secondary" href="https://github.com/INEZA-24/RepoPilot" target="_blank" rel="noreferrer" aria-label="View RepoPilot source on GitHub">
              View source on GitHub
            </a>
          </div>
        </div>
        <div className="window-card" aria-hidden="true">
          <div className="window-top"><span className="dot" style={{ background: "#ef4444" }} /><span className="dot" style={{ background: "#f59e0b" }} /><span className="dot" style={{ background: "#22c55e" }} /></div>
          <div style={{ padding: 22, display: "grid", gap: 12 }}>
            <span className="chip">Public repository</span>
            <strong style={{ fontSize: 26, letterSpacing: "-.04em" }}>owner/project</strong>
            <p className="muted" style={{ margin: 0 }}>Metadata, README, issues, and verified contribution entry points.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
