import type { LanguageStat } from "@/types/github";

export function TechStackCard({ languages }: { languages: LanguageStat[] }) {
  return (
    <article className="card" style={{ padding: 24 }}>
      <h2>Tech stack</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {languages.length === 0 ? <p style={{ color: "var(--muted)" }}>No language data found.</p> : null}
        {languages.map((language) => (
          <div key={language.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <strong>{language.name}</strong>
              <span style={{ color: "var(--muted)" }}>{language.percentage}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "rgba(148, 163, 184, 0.15)" }}>
              <div style={{ width: `${language.percentage}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
