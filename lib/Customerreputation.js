import { postJSON } from "@/lib/apiClient";


export async function runCustomerReputation({
  companyName,
  purpose,
  followUpAnswers,
}) {
  return postJSON("/api/agents/customer-reputation/research", {
    company_name: companyName,
    purpose,
    follow_up_answers: followUpAnswers || {},
  });
}
