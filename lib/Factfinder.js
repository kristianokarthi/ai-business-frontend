import { postJSON } from "@/lib/apiClient";


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

  return postJSON("/api/agents/fact-finder", payload);
}
