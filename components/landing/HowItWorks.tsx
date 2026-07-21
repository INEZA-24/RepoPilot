const steps = [
  "Paste a public GitHub repository URL",
  "Review repository context",
  "Add contributor preferences",
  "Generate verified contribution entry points",
];

export function HowItWorks() {
  return (
    <section className="section-block container">
      <h2 className="section-heading">How it works</h2>
      <div className="steps-grid">
        {steps.map((step, index) => (
          <article className="card" key={step} style={{ padding: 24 }}>
            <span className="chip">Step {index + 1}</span>
            <h3 style={{ marginTop: 16 }}>{step}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
