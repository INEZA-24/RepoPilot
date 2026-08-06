"use client";

import { useState } from "react";
import { hasDisplayableIssueLink, parseDisplayableFallbackAnalysis } from "@/lib/ai/displayableFallback";
import type { AIEntryPointAnalysis, ContributorProfile, EntryPointRecommendation } from "@/types/entryPoints";

const EFFORT_LABELS: Record<EntryPointRecommendation["estimatedEffort"], string> = {
  "under-1-hour": "Under 1 hour",
  "1-3-hours": "1–3 hours",
  "3-5-hours": "3–5 hours",
  "multi-session": "Multiple sessions",
};

export function AIEntryPointsCard({ repoUrl }: { repoUrl: string }) {
  const [experienceLevel, setExperienceLevel] = useState<ContributorProfile["experienceLevel"]>("beginner");
  const [preferredContributionType, setPreferredContributionType] =
    useState<ContributorProfile["preferredContributionType"]>("any");
  const [skills, setSkills] = useState("");
  const [goal, setGoal] = useState("");
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
            goal: goal.trim(),
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

        throw new Error(data.error ?? "Unable to generate contribution missions.");
      }

      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error while generating contribution missions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{ padding: 24, marginTop: 16 }}>
      <span className="badge">Contributor intelligence</span>
      <h2>Find your best contribution missions</h2>
      <p className="muted">
        Tell RepoPilot what you know and what kind of contribution you prefer. Your profile personalizes the results,
        while repository evidence is used to verify whether each mission is actionable.
      </p>

      <div className="ai-form-grid">
        <label className="form-field">
          <span className="field-label">Experience level</span>
          <select
            className="select"
            value={experienceLevel}
            onChange={(event) => setExperienceLevel(event.target.value as ContributorProfile["experienceLevel"])}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label className="form-field">
          <span className="field-label">Preferred contribution</span>
          <select
            className="select"
            value={preferredContributionType}
            onChange={(event) =>
              setPreferredContributionType(event.target.value as ContributorProfile["preferredContributionType"])
            }
          >
            <option value="any">Any suitable contribution</option>
            <option value="code">Code</option>
            <option value="documentation">Documentation</option>
            <option value="tests">Tests</option>
            <option value="bug-fixes">Bug fixes</option>
          </select>
        </label>
        <label className="form-field">
          <span className="field-label">Known skills</span>
          <input
            className="input"
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            placeholder="Python, Flask, React"
          />
          <span className="helper-text">Separate skills with commas.</span>
        </label>
      </div>

      <label className="form-field" style={{ marginTop: 14 }}>
        <span className="field-label">Contribution goal (optional)</span>
        <input
          className="input"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          placeholder="For example: make my first meaningful backend contribution"
          maxLength={160}
        />
      </label>

      <div className="info-panel" style={{ marginTop: 16 }}>
        <strong>Your availability is not part of the profile.</strong>
        <div className="helper-text">
          Each mission includes an approximate effort estimate, and you decide whether it fits your schedule.
        </div>
      </div>

      <button className="btn btn-primary" onClick={generate} disabled={loading} aria-busy={loading} style={{ marginTop: 16 }}>
        {loading ? <><span className="spinner" aria-hidden="true" /> Generating missions…</> : "Generate contribution missions"}
      </button>

      {error ? <p role="alert" className="error-text">{error}</p> : null}

      {analysis ? <MissionResults analysis={analysis} /> : null}
    </section>
  );
}

function MissionResults({ analysis }: { analysis: AIEntryPointAnalysis }) {
  return (
    <div style={{ marginTop: 24, display: "grid", gap: 14 }}>
      <div className="chip-row">
        <span className="chip">{analysis.recommendations.length} missions</span>
        <span className="chip">Source: {analysis.source === "nemotron" ? "AI + verified evidence" : "Verified fallback"}</span>
      </div>
      {analysis.recommendations.length === 0 ? (
        <p className="muted">No suitable contribution missions were found from the available repository evidence.</p>
      ) : null}
      {analysis.recommendations.map((recommendation, index) => (
        <article
          key={recommendation.id}
          className="elevated-card"
          style={{ padding: 20 }}
        >
          <div className="chip-row">
            <span className="badge">Mission {index + 1}</span>
            <span className="chip">{recommendation.type}</span>
            <span className="chip">{recommendation.difficulty}</span>
            <span className="chip">{EFFORT_LABELS[recommendation.estimatedEffort]}</span>
            <span className="chip">{recommendation.confidence} confidence</span>
          </div>
          <h3 style={{ fontSize: 24, marginBottom: 8 }}>{recommendation.title}</h3>
          <p className="muted">{recommendation.summary}</p>
          {hasDisplayableIssueLink(recommendation) ? (
            <a
              href={recommendation.issueUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--accent-2)", fontWeight: 700 }}
            >
              Open verified issue #{recommendation.issueNumber} →
            </a>
          ) : null}
          <h4>Why this mission fits</h4>
          <p>{recommendation.whyItFits}</p>
          <List title="Skills involved" items={recommendation.skillsRequired} />
          <List title="How to begin" items={recommendation.firstSteps} />
          <List title="Repository evidence" items={recommendation.evidence} />
          <List title="Check before starting" items={recommendation.warnings} />
          {recommendation.filesToRead.length ? (
            <>
              <h4>Files to inspect</h4>
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
      <List title="Analysis limitations" items={analysis.limitations} />
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
