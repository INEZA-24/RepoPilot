const features = [
  "Repository metadata",
  "Language breakdown",
  "README preview",
  "Open issue discovery",
];

export function Features() {
  return (
    <section className="container" style={{ padding: "32px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {features.map((feature) => (
          <article className="card" key={feature} style={{ padding: 24 }}>
            <div style={{ color: "var(--accent-2)", fontSize: 28 }}>✦</div>
            <h3>{feature}</h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              Phase 1 focuses only on context that helps a contributor decide where to start today.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
