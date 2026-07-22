"use client";

import { useState } from "react";
import { hasDisplayableIssueLink, parseDisplayableFallbackAnalysis } from "@/lib/ai/displayableFallback";
import type { AIEntryPointAnalysis, ContributorProfile } from "@/types/entryPoints";

export function AIEntryPointsCard({ repoUrl }: { repoUrl: string }) {
  const [experienceLevel, setExperienceLevel] = useState<ContributorProfile["experienceLevel"]>("beginner");
  const [preferredContributionType, setPreferredContributionType] =
    useState<ContributorProfile["preferredContributionType"]>("any");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<AIEntryPointAnalysis | null>(null);

  async function generate() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/entry-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl,
          profile: {
            experienceLevel,
            preferredContributionType,
            skills: skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          },
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        const fallback = parseDisplayableFallbackAnalysis(data);

        if (fallback) {
          setAnalysis(fallback);
          return;
        }

        throw new Error(data.error ?? "Unable to generate entry points.");
      }

      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error while generating entry points.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{ padding: 24, marginTop: 16 }}>
      <span className="badge">Phase 2A Nemotron entry points</span>
      <h2>Contribution entry points</h2>
      <p style={{ color: "var(--muted)" }}>
        Generate up to three evidence-grounded ways to start contributing. NVIDIA is called only after you click.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <label>
          Experience
          <select
            value={experienceLevel}
            onChange={(event) => setExperienceLevel(event.target.value as ContributorProfile["experienceLevel"])}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label>
          Preferred type
          <select
            value={preferredContributionType}
            onChange={(event) =>
              setPreferredContributionType(event.target.value as ContributorProfile["preferredContributionType"])
            }
          >
            <option value="any">Any</option>
            <option value="code">Code</option>
            <option value="documentation">Documentation</option>
            <option value="tests">Tests</option>
            <option value="bug-fixes">Bug Fixes</option>
          </select>
        </label>
        <label>
          Known skills
          <input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="javascript, react" />
        </label>
      </div>

      <button onClick={generate} disabled={loading} aria-busy={loading} style={{ marginTop: 16 }}>
        {loading ? "Generating…" : "Generate AI Entry Points"}
      </button>

      {error ? <p role="alert" style={{ color: "#fca5a5" }}>{error}</p> : null}

      {analysis ? <EntryPointResults analysis={analysis} /> : null}
    </section>
  );
}

function EntryPointResults({ analysis }: { analysis: AIEntryPointAnalysis }) {
  return (
    <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
      <p className="badge">Source: {analysis.source}</p>
      {analysis.recommendations.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No suitable recommendations found from the available evidence.</p>
      ) : null}
      {analysis.recommendations.map((recommendation) => (
        <article
          key={recommendation.id}
          style={{ border: "1px solid var(--border)", borderRadius: 18, padding: 18 }}
        >
          <h3>{recommendation.title}</h3>
          <p>
            <span className="badge">{recommendation.type}</span>{" "}
            <span className="badge">{recommendation.difficulty}</span>{" "}
            <span className="badge">{recommendation.confidence} confidence</span>
          </p>
          <p style={{ color: "var(--muted)" }}>{recommendation.summary}</p>
          {hasDisplayableIssueLink(recommendation) ? (
            <a
              href={recommendation.issueUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--accent-2)", fontWeight: 700 }}
            >
              Verified issue #{recommendation.issueNumber} →
            </a>
          ) : null}
          <h4>Why it fits</h4>
          <p>{recommendation.whyItFits}</p>
          <List title="Skills required" items={recommendation.skillsRequired} />
          <List title="First steps" items={recommendation.firstSteps} />
          <List title="Evidence" items={recommendation.evidence} />
          <List title="Warnings" items={recommendation.warnings} />
          {recommendation.filesToRead.length ? (
            <>
              <h4>Files to read</h4>
              <ul>
                {recommendation.filesToRead.map((file) => (
                  <li key={file.path}>
                    <code>{file.path}</code> — {file.reason}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </article>
      ))}
      <List title="Limitations" items={analysis.limitations} />
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return items.length ? (
    <>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  ) : null;
}
