import type { ReadmePreview } from "@/types/github";

export function ReadmeCard({ readme }: { readme: ReadmePreview | null }) {
  return (
    <article className="card" style={{ padding: 24 }}>
      <h2>README preview</h2>
      {readme ? (
        <>
          <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{readme.excerpt || "README content is empty."}</p>
          <a href={readme.html_url} target="_blank" rel="noreferrer" style={{ color: "var(--accent-2)", fontWeight: 700 }}>
            Open README on GitHub →
          </a>
        </>
      ) : (
        <p style={{ color: "var(--muted)" }}>No README found. This can make contributor onboarding harder.</p>
      )}
    </article>
  );
}
