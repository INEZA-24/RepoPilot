import Link from "next/link";
import { AIEntryPointsCard } from "@/components/dashboard/AIEntryPointsCard";
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
          <Link href="/" style={{ color: "var(--accent-2)", fontWeight: 700 }}>Return home →</Link>
        </div>
      </main>
    );
  }

  let analysis;
  try {
    const { owner, repo } = parseRepoUrl(repoUrl);
    analysis = await analyzeRepository(owner, repo);
  } catch (error) {
    return (
      <main className="container" style={{ padding: "80px 0" }}>
        <div className="card" style={{ padding: 32 }}>
          <h1>We could not analyze that repository.</h1>
          <p style={{ color: "var(--muted)" }}>{error instanceof Error ? error.message : "Check the URL, repository visibility, network connection, or GitHub rate limit."}</p>
          <Link href="/" style={{ color: "var(--accent-2)", fontWeight: 700 }}>Try another repository →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: "40px 0 80px" }}>
      <RepoHeader repository={analysis.repository} />
      <AIEntryPointsCard repoUrl={repoUrl} />
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
