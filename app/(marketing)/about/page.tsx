export default function AboutPage() {
  return (
    <main className="container" style={{ padding: "80px 0" }}>
      <span className="badge">Open Source Contributor Onboarding</span>
      <h1 style={{ fontSize: "clamp(40px, 8vw, 72px)", letterSpacing: "-0.06em" }}>
        RepoPilot is GPS for open source.
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 20, lineHeight: 1.7, maxWidth: 760 }}>
        Developers lose hours discovering where to start in an unfamiliar repository. RepoPilot turns a
        GitHub URL into a focused Phase 1 dashboard with metadata, languages, README context, and open
        issues so first-time contributors can move from confusion to action faster.
      </p>
    </main>
  );
}
