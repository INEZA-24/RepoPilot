export function DemoPreview() {
  return (
    <section className="section-block container" style={{ paddingBottom: 96 }}>
      <div className="window-card">
        <div className="window-top">
          <span className="dot" style={{ background: "#ef4444" }} />
          <span className="dot" style={{ background: "#f59e0b" }} />
          <span className="dot" style={{ background: "#22c55e" }} />
        </div>
        <div style={{ padding: 28 }}>
          <div className="dashboard-grid" style={{ marginTop: 0 }}>
            {[
              ["Repository", "vercel/next.js"],
              ["Primary language", "TypeScript"],
              ["Open issues", "Entry-point candidates"],
              ["AI stage", "Optional verified recommendations"],
            ].map(([label, value]) => (
              <div key={label} className="elevated-card" style={{ padding: 18 }}>
                <small className="muted">{label}</small>
                <strong style={{ display: "block", marginTop: 8 }}>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
