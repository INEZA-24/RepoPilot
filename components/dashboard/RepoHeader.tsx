import type { RepositoryMetadata } from "@/types/github";
import { Stat } from "@/components/ui/Stat";

export function RepoHeader({ repository }: { repository: RepositoryMetadata }) {
  return (
    <header className="card" style={{ padding: 28 }}>
      <span className="badge">Phase 1 repository snapshot</span>
      <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", letterSpacing: "-0.06em", margin: "18px 0 12px" }}>
        {repository.full_name}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 18, lineHeight: 1.6, maxWidth: 820 }}>
        {repository.description ?? "No repository description provided."}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginTop: 24 }}>
        <Stat label="Stars" value={repository.stargazers_count.toLocaleString()} />
        <Stat label="Forks" value={repository.forks_count.toLocaleString()} />
        <Stat label="Open issues" value={repository.open_issues_count.toLocaleString()} />
        <Stat label="Default branch" value={repository.default_branch} />
      </div>
    </header>
  );
}
