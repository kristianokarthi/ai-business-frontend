const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://ai-agent-business-analysis-backend.vercel.app"
).replace(/\/$/, "");


function getErrorMessage(body, status) {
  const detail = body?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (detail?.message) {
    return detail.message;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg || "Invalid request")
      .join(", ");
  }

  return `Fact Finder request failed (${status}).`;
}


export async function runFactFinder({
  companyName,
  officialWebsite,
  purpose,
  followUpAnswers,
}) {
  const payload = {
    company_name: companyName.trim(),
    official_website: officialWebsite.trim(),
    purpose,
    follow_up_answers: Object.fromEntries(
      Object.entries(followUpAnswers || {}).filter(
        ([, value]) => value?.trim()
      )
    ),
  };

  const response = await fetch(
    `${API_BASE}/api/agents/fact-finder`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(body, response.status));
  }

  return body;
}
