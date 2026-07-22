import type { RepositoryMetadata } from "@/types/github";
import { Stat } from "@/components/ui/Stat";

export function RepoHeader({ repository }: { repository: RepositoryMetadata }) {
  return (
    <header className="elevated-card" style={{ padding: 28 }}>
      <div className="repo-header__top">
        <div>
          <div className="chip-row">
            <span className="chip">Public repository</span>
            <span className="chip">Default branch: {repository.default_branch}</span>
          </div>
          <h1 className="repo-title">{repository.full_name}</h1>
        </div>
        <a className="btn btn-secondary" href={repository.html_url} target="_blank" rel="noreferrer" aria-label={`View ${repository.full_name} on GitHub`}>
          View on GitHub
        </a>
      </div>
      <p className="hero-copy" style={{ fontSize: 18, maxWidth: 820 }}>
        {repository.description ?? "No repository description provided."}
      </p>
      <div className="dashboard-grid" style={{ marginTop: 24 }}>
        <Stat label="Stars" value={repository.stargazers_count.toLocaleString()} />
        <Stat label="Forks" value={repository.forks_count.toLocaleString()} />
        <Stat label="Open issues" value={repository.open_issues_count.toLocaleString()} />
        <Stat label="Default branch" value={repository.default_branch} />
      </div>
    </header>
  );
}
