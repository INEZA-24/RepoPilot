import type { RepositoryIssue } from "@/types/github";

export function IssuesCard({ issues }: { issues: RepositoryIssue[] }) {
  return (
    <article className="card" style={{ padding: 24 }}>
      <h2>Open issues</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {issues.length === 0 ? <p style={{ color: "var(--muted)" }}>No open issues found in the latest issue sample.</p> : null}
        {issues.map((issue) => (
          <a key={issue.id} href={issue.html_url} target="_blank" rel="noreferrer" style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}>
            <strong>#{issue.number} {issue.title}</strong>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              {issue.labels.slice(0, 4).map((label) => (
                <span key={label} className="badge" style={{ padding: "4px 8px", fontSize: 12 }}>{label}</span>
              ))}
              <span style={{ color: "var(--muted)", fontSize: 13 }}>{issue.comments} comments</span>
            </div>
          </a>
        ))}
      </div>
    </article>
  );
}
