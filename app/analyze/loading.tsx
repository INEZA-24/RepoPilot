export default function Loading() {
  return (
    <main className="site-main container" style={{ padding: "64px 0 88px" }}>
      <div className="elevated-card" style={{ padding: 32 }} aria-busy="true">
        <span className="badge">Analyzing repository</span>
        <h1 className="section-heading" style={{ marginTop: 18 }}>Building your contributor dashboard…</h1>
        <p className="muted">Fetching public repository context and preparing the dashboard.</p>
      </div>
    </main>
  );
}
