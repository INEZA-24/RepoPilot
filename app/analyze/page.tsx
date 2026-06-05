import { IssuesCard } from "@/components/dashboard/IssuesCard";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { ReadmeCard } from "@/components/dashboard/ReadmeCard";
import { RepoHeader } from "@/components/dashboard/RepoHeader";
import { TechStackCard } from "@/components/dashboard/TechStackCard";
import { analyzeRepository } from "@/lib/github/analyzeRepository";
import { parseRepoUrl } from "@/lib/utils/parseRepoUrl";

export default async function AnalyzePage({ searchParams }: { searchParams: Promise<{ repo?: string }> }) {
  const { repo: repoUrl } = await searchParams;

  if (!repoUrl) {
    return (
      <main className="container" style={{ padding: "80px 0" }}>
        <div className="card" style={{ padding: 32 }}>
          <h1>Paste a GitHub repository URL to begin.</h1>
          <a href="/" style={{ color: "var(--accent-2)", fontWeight: 700 }}>Return home →</a>
        </div>
      </main>
    );
  }

  const { owner, repo } = parseRepoUrl(repoUrl);
  const analysis = await analyzeRepository(owner, repo);

  return (
    <main className="container" style={{ padding: "40px 0 80px" }}>
      <RepoHeader repository={analysis.repository} />
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 16 }}>
        <div style={{ display: "grid", gap: 16 }}>
          <OverviewCard repository={analysis.repository} />
          <TechStackCard languages={analysis.languages} />
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <ReadmeCard readme={analysis.readme} />
          <IssuesCard issues={analysis.issues} />
        </div>
      </section>
    </main>
  );
}
