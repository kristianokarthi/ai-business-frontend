// Client for Agent 1 — Research and Evidence ("Fact Finder").
// Set NEXT_PUBLIC_API_BASE_URL in your env; falls back to the deployed
// backend so this works out of the box during development.

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://ai-agent-business-analysis-backend.vercel.app";

export async function runFactFinder({
  companyName,
  officialWebsite,
  purpose,
  followUpAnswers,
  documents = [],
}) {
  const payload = {
    company_name: companyName,
    official_website: officialWebsite || null,
    purpose,
    // Backend expects a map; drop empty/skipped answers rather than send
    // empty strings, so skipped questions become declared assumptions.
    follow_up_answers: Object.fromEntries(
      Object.entries(followUpAnswers || {}).filter(([, v]) => v && v.trim())
    ),
    // No ingestion/search step wired up yet on the frontend, so this ships
    // empty for now. Agent 1 only uses supplied documents, so results will
    // reflect whatever documents are eventually passed here.
    documents,
  };

  const response = await fetch(`${API_BASE}/api/agents/fact-finder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Fact Finder request failed (${response.status}): ${text || response.statusText}`
    );
  }

  return response.json();
}