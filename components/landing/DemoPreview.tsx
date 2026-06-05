export function DemoPreview() {
  return (
    <section className="container" style={{ padding: "32px 0 96px" }}>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ef4444" }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#f59e0b" }} />
          <span style={{ width: 12, height: 12, borderRadius: 999, background: "#22c55e" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[
            ["Repo", "vercel/next.js"],
            ["Primary language", "TypeScript"],
            ["Open issues", "Contributor entry points"],
          ].map(([label, value]) => (
            <div key={label} style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 18 }}>
              <small style={{ color: "var(--muted)" }}>{label}</small>
              <strong style={{ display: "block", marginTop: 8 }}>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
