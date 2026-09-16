import { postJSON } from "@/lib/apiClient";


export async function runMarketCompetitor({
  purpose,
  followUpAnswers,
  companyEvidence,
  businessFundamentals,
}) {
  return postJSON("/api/agents/market-competitor/research", {
    purpose,
    follow_up_answers: followUpAnswers || {},
    company_evidence: companyEvidence,
    business_fundamentals: businessFundamentals,
  });
}
