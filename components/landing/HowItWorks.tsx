const steps = ["Paste a GitHub URL", "RepoPilot fetches public repository signals", "Review a focused contributor dashboard"];

export function HowItWorks() {
  return (
    <section className="container" style={{ padding: "56px 0" }}>
      <h2 style={{ fontSize: 40, letterSpacing: "-0.05em" }}>How it works</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {steps.map((step, index) => (
          <article className="card" key={step} style={{ padding: 24 }}>
            <span className="badge">Step {index + 1}</span>
            <h3>{step}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
