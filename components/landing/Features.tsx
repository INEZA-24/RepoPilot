const features = [
  ["Repository context", "Metadata, languages, README previews, and open issues remain the core Phase 1 dashboard."],
  ["Contribution entry points", "Phase 2A adds optional Nemotron recommendations after the user asks for them."],
  ["Verified evidence", "Issue numbers, issue URLs, and file paths are checked before results are shown."],
  ["Fallback ready", "A deterministic heuristic fallback keeps the dashboard useful if AI output is unavailable."],
];

function Icon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l7 4v6c0 4-2.8 6.8-7 8-4.2-1.2-7-4-7-8V7l7-4z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 12l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Features() {
  return (
    <section className="section-block container">
      <div style={{ maxWidth: 720, marginBottom: 20 }}>
        <h2 className="section-heading">Built for honest contributor orientation.</h2>
        <p className="muted">RepoPilot surfaces what exists in the repository without inventing scores, chats, or unsupported automation.</p>
      </div>
      <div className="feature-grid">
        {features.map(([feature, description]) => (
          <article className="elevated-card" key={feature} style={{ padding: 24 }}>
            <div style={{ color: "var(--accent-2)", marginBottom: 14 }}><Icon /></div>
            <h3>{feature}</h3>
            <p className="muted" style={{ lineHeight: 1.65 }}>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
