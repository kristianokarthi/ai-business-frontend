import { postJSON } from "@/lib/apiClient";


function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
}


function companySources(form, factFinder) {
  const identity = factFinder.result?.company_identity || {};
  const url = identity.official_website || form.website || null;
  const title = `${identity.name || form.companyName} official website`;

  return (factFinder.result?.sources_used || []).slice(0, 5).map((sourceId) => ({
    evidence_id: sourceId,
    title,
    url,
    source_type: "company_official",
  }));
}


function marketSources(marketCompetitor) {
  return (marketCompetitor.collection?.market_documents || []).map((source) => ({
    evidence_id: source.source_id,
    title: source.title,
    url: source.url,
    source_type: source.source_type,
  }));
}


function publicSignalSources(customerReputation) {
  return (customerReputation.collection?.signal_documents || []).map((source) => ({
    evidence_id: source.signal_id,
    title: source.title,
    url: source.url,
    source_type: source.source_type,
  }));
}


export async function runReportStrategist({
  form,
  factFinder,
  businessFundamentals,
  marketCompetitor,
  customerReputation,
}) {
  const collectionWarnings = uniqueStrings([
    ...(marketCompetitor.collection?.warnings || []),
    ...(customerReputation.collection?.warnings || []),
  ]).slice(0, 20);

  return postJSON("/api/agents/report-strategist/research", {
    purpose: form.purpose,
    follow_up_answers: form.followUpAnswers || {},
    company_evidence: factFinder.result,
    business_fundamentals: businessFundamentals.result,
    market_analysis: marketCompetitor.result,
    customer_reputation: customerReputation.result,
    company_sources: companySources(form, factFinder),
    market_sources: marketSources(marketCompetitor),
    public_signal_sources: publicSignalSources(customerReputation),
    collection_warnings: collectionWarnings,
    max_context_tokens: 5000,
  });
}
