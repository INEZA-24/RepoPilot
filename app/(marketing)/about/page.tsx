export default function AboutPage() {
  return (
    <main className="site-main container" style={{ padding: "64px 0 88px" }}>
      <span className="badge">Open Source Contributor Onboarding</span>
      <h1 className="page-heading">RepoPilot is GPS for open source.</h1>
      <p className="hero-copy">
        Developers lose hours discovering where to start in an unfamiliar repository. RepoPilot turns a GitHub URL into
        a focused dashboard with repository context and optional verified contribution entry points so first-time
        contributors can move from confusion to action faster.
      </p>
      <div className="feature-grid" style={{ marginTop: 28 }}>
        <article className="elevated-card" style={{ padding: 24 }}>
          <h2 className="section-heading" style={{ fontSize: 28 }}>What is implemented</h2>
          <p className="muted">Phase 1 analysis plus user-triggered Phase 2A contribution recommendations.</p>
        </article>
        <article className="elevated-card" style={{ padding: 24 }}>
          <h2 className="section-heading" style={{ fontSize: 28 }}>What stays guarded</h2>
          <p className="muted">No private repositories, cloning, code execution, scoring, generic chat, or automatic pull requests.</p>
        </article>
      </div>
    </main>
  );
}
