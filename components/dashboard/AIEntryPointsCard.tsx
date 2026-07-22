"use client";

import { useState, type FormEvent } from "react";
import { hasDisplayableIssueLink, parseDisplayableFallbackAnalysis } from "@/lib/ai/displayableFallback";
import type { AIEntryPointAnalysis, ContributorProfile, EntryPointRecommendation } from "@/types/entryPoints";

const controlStyle = {
  minHeight: 46,
  borderRadius: 14,
  border: "1px solid rgba(148, 163, 184, 0.34)",
  backgroundColor: "#0b1220",
  color: "var(--text)",
  padding: "0 14px",
};

const generateButtonStyle = {
  marginTop: 18,
  width: "100%",
  minHeight: 46,
  borderRadius: 14,
  border: 0,
  color: "#fff",
  background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 46%, #06b6d4 100%)",
  boxShadow: "0 16px 42px rgba(124, 58, 237, 0.28), inset 0 1px 0 rgba(255,255,255,.22)",
};

export function AIEntryPointsCard({ repoUrl }: { repoUrl: string }) {
  const [experienceLevel, setExperienceLevel] = useState<ContributorProfile["experienceLevel"]>("beginner");
  const [preferredContributionType, setPreferredContributionType] =
    useState<ContributorProfile["preferredContributionType"]>("any");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<AIEntryPointAnalysis | null>(null);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
            skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
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
    <section className="elevated-card" style={{ padding: 24, marginTop: 16 }}>
      <div className="repo-header__top">
        <div>
          <span className="badge">Contribution recommendations</span>
          <h2 className="section-heading" style={{ marginTop: 16 }}>Contribution entry points</h2>
          <p className="muted" style={{ lineHeight: 1.65, maxWidth: 760 }}>
            Generate up to three evidence-grounded ways to start contributing. RepoPilot only starts when you submit this form.
          </p>
        </div>
        {analysis ? <span className="chip">Source: {analysis.source === "nemotron" ? "AI recommendations" : "Heuristic fallback"}</span> : null}
      </div>

      <form onSubmit={generate} aria-busy={loading}>
        <div className="ai-form-grid">
          <label className="form-field">
            <span className="field-label">Experience</span>
            <select className="select" style={controlStyle} value={experienceLevel} disabled={loading} onChange={(event) => setExperienceLevel(event.target.value as ContributorProfile["experienceLevel"])}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label className="form-field">
            <span className="field-label">Preferred contribution type</span>
            <select className="select" style={controlStyle} value={preferredContributionType} disabled={loading} onChange={(event) => setPreferredContributionType(event.target.value as ContributorProfile["preferredContributionType"])}>
              <option value="any">Any</option>
              <option value="code">Code</option>
              <option value="documentation">Documentation</option>
              <option value="tests">Tests</option>
              <option value="bug-fixes">Bug fixes</option>
            </select>
          </label>
          <label className="form-field">
            <span className="field-label">Known skills</span>
            <input className="input" style={controlStyle} value={skills} disabled={loading} onChange={(event) => setSkills(event.target.value)} placeholder="javascript, react" />
            <span className="helper-text">Example: TypeScript, docs, testing</span>
          </label>
        </div>
        <button className="btn btn-primary" disabled={loading} style={generateButtonStyle}>
          {loading ? <><span className="spinner" aria-hidden="true" /> Wait as RepoPilot generates recommendations…</> : "Generate"}
        </button>
      </form>

      {error ? <p role="alert" className="error-text">{error}</p> : null}
      {analysis ? <EntryPointResults analysis={analysis} /> : null}
    </section>
  );
}

function EntryPointResults({ analysis }: { analysis: AIEntryPointAnalysis }) {
  return (
    <div style={{ marginTop: 22, display: "grid", gap: 14 }}>
      {analysis.limitations.length ? <Panel title="Limitations" items={analysis.limitations} kind="info" /> : null}
      {analysis.recommendations.length === 0 ? <p className="muted">No suitable recommendations found from the available evidence.</p> : null}
      {analysis.recommendations.map((recommendation) => <RecommendationCard key={recommendation.id} recommendation={recommendation} />)}
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: EntryPointRecommendation }) {
  return (
    <article className="card" style={{ padding: 20 }}>
      <div className="repo-header__top">
        <h3 style={{ margin: 0, fontSize: 22 }}>{recommendation.title}</h3>
        <div className="chip-row">
          <span className="chip">{recommendation.type}</span>
          <span className="chip">{recommendation.difficulty}</span>
          <span className="chip">{recommendation.confidence} confidence</span>
        </div>
      </div>
      <p className="muted" style={{ lineHeight: 1.65 }}>{recommendation.summary}</p>
      {hasDisplayableIssueLink(recommendation) ? (
        <a className="btn btn-secondary" href={recommendation.issueUrl} target="_blank" rel="noreferrer" aria-label={`Open verified GitHub issue ${recommendation.issueNumber}`}>
          Verified GitHub issue #{recommendation.issueNumber}
        </a>
      ) : null}
      <h4>Why it fits</h4>
      <p>{recommendation.whyItFits}</p>
      {recommendation.skillsRequired.length ? <div className="chip-row">{recommendation.skillsRequired.map((skill) => <span className="chip" key={skill}>{skill}</span>)}</div> : null}
      {recommendation.firstSteps.length ? <><h4>First steps</h4><ol>{recommendation.firstSteps.map((step) => <li key={step}>{step}</li>)}</ol></> : null}
      {recommendation.filesToRead.length ? <><h4>Files to read</h4><ul>{recommendation.filesToRead.map((file) => <li key={file.path}><code>{file.path}</code> — {file.reason}</li>)}</ul></> : null}
      {recommendation.evidence.length ? <Panel title="Evidence" items={recommendation.evidence} kind="info" /> : null}
      {recommendation.warnings.length ? <Panel title="Warnings" items={recommendation.warnings} kind="warning" /> : null}
    </article>
  );
}

function Panel({ title, items, kind }: { title: string; items: string[]; kind: "info" | "warning" }) {
  return <div className={kind === "warning" ? "warning-panel" : "info-panel"}><strong>{title}</strong><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}
