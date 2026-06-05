import type { RepositoryMetadata } from "@/types/github";

export function OverviewCard({ repository }: { repository: RepositoryMetadata }) {
  return (
    <article className="card" style={{ padding: 24 }}>
      <h2>Repository overview</h2>
      <dl style={{ display: "grid", gap: 14, color: "var(--muted)" }}>
        <div><dt>Owner</dt><dd style={{ color: "var(--text)", margin: 0 }}>{repository.owner.login}</dd></div>
        <div><dt>License</dt><dd style={{ color: "var(--text)", margin: 0 }}>{repository.license?.name ?? "Not declared"}</dd></div>
        <div><dt>Last pushed</dt><dd style={{ color: "var(--text)", margin: 0 }}>{new Date(repository.pushed_at).toLocaleDateString()}</dd></div>
      </dl>
    </article>
  );
}
