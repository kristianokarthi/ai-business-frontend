import { postJSON } from "@/lib/apiClient";


export async function runBusinessFundamentals({
  purpose,
  followUpAnswers,
  evidencePack,
}) {
  return postJSON("/api/agents/business-fundamentals", {
    purpose,
    follow_up_answers: followUpAnswers || {},
    evidence_pack: evidencePack,
  });
}
