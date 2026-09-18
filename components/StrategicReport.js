"use client";


const PURPOSE_LABELS = {
  general_research: "General business research",
  start_similar_business: "New business assessment",
  partner_or_supplier: "Partnership assessment",
  stock_research: "Stock research",
};


const SOURCE_LABELS = {
  company_official: "Company sources",
  competitor_official: "Competitor sources",
  government: "Government",
  industry_report: "Industry reports",
  news: "News",
  customer_review: "Customer reviews",
  employee_review: "Employee reviews",
  forum: "Forums",
  social_media: "Social media",
  survey: "Surveys",
  other: "Other",
  unknown: "Unclassified",
};


function uniqueItems(items) {
  return [...new Set((items || []).filter(Boolean))];
}


function SummaryMetric({ label, value, description, tone = "neutral" }) {
  const tones = {
    neutral: "border-[#D7D9D0] bg-white text-[#211E1A]",
    positive: "border-[#6F9278]/25 bg-[#6F9278]/8 text-[#36513D]",
    caution: "border-[#C58B34]/25 bg-[#C58B34]/8 text-[#684A18]",
    accent: "border-[#365A50]/25 bg-[#365A50]/8 text-[#29483F]",
  };

  return (
    <div className={`report-break-avoid rounded-xl border p-4 ${tones[tone]}`}>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm font-medium">{label}</p>
      {description && <p className="mt-1 text-xs leading-5 opacity-70">{description}</p>}
    </div>
  );
}


function InsightCard({ insight, number, tone = "neutral" }) {
  if (!insight) return null;

  const tones = {
    neutral: "border-[#D7D9D0] bg-white",
    positive: "border-[#6F9278]/30 bg-[#F5F8F5]",
    caution: "border-[#C58B34]/30 bg-[#FFFBF3]",
    critical: "border-[#9B3B33]/25 bg-[#FFF8F7]",
  };

  return (
    <article className={`report-break-avoid rounded-xl border p-5 ${tones[tone]}`}>
      <div className="flex gap-3">
        {number != null && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E9ECE6] text-xs font-semibold text-[#4C594E]">
            {number}
          </span>
        )}
        <div className="min-w-0">
          <h4 className="font-semibold leading-6 text-[#211E1A]">{insight.title}</h4>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#58554C]">
            {insight.analysis}
          </p>
          {insight.evidence_ids?.length > 0 && (
            <details className="report-evidence mt-3 text-xs text-[#7A776C]">
              <summary className="cursor-pointer select-none">View supporting evidence</summary>
              <p className="mt-1">{insight.evidence_ids.join(", ")}</p>
            </details>
          )}
        </div>
      </div>
    </article>
  );
}


function InsightGroup({ eyebrow, title, description, insights, tone = "neutral", columns = false }) {
  if (!insights?.length) return null;

  return (
    <section className="report-section">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6F786C]">{eyebrow}</p>
      )}
      <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#211E1A]">{title}</h3>
      {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6D6A5E]">{description}</p>}
      <div className={`mt-4 grid gap-3 ${columns ? "lg:grid-cols-2" : ""}`}>
        {insights.map((insight, index) => (
          <InsightCard key={`${title}-${insight.title}-${index}`} insight={insight} number={index + 1} tone={tone} />
        ))}
      </div>
    </section>
  );
}


function OpportunityRiskChart({ opportunities, risks }) {
  const opportunityCount = opportunities?.length || 0;
  const riskCount = risks?.length || 0;
  const total = opportunityCount + riskCount;
  const opportunityWidth = total ? (opportunityCount / total) * 100 : 50;
  const riskWidth = total ? (riskCount / total) * 100 : 50;

  return (
    <div className="report-break-avoid rounded-xl border border-[#D7D9D0] bg-white p-5">
      <p className="text-sm font-semibold text-[#211E1A]">Opportunity and risk coverage</p>
      <p className="mt-1 text-xs leading-5 text-[#7A776C]">Number of evidence-backed themes included in this report</p>
      <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-[#ECEDE8]" role="img" aria-label={`${opportunityCount} opportunities and ${riskCount} risks`}>
        <div className="bg-[#6F9278]" style={{ width: `${opportunityWidth}%` }} />
        <div className="bg-[#C77368]" style={{ width: `${riskWidth}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-semibold text-[#36513D]">{opportunityCount}</p>
          <p className="text-xs text-[#6D6A5E]">Opportunities</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[#8B4139]">{riskCount}</p>
          <p className="text-xs text-[#6D6A5E]">Risks</p>
        </div>
      </div>
    </div>
  );
}


function SourceMixChart({ sources }) {
  const counts = (sources || []).reduce((summary, source) => {
    const key = source.source_type || "unknown";
    summary[key] = (summary[key] || 0) + 1;
    return summary;
  }, {});
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const maximum = Math.max(...rows.map(([, count]) => count), 1);

  return (
    <div className="report-break-avoid rounded-xl border border-[#D7D9D0] bg-white p-5">
      <p className="text-sm font-semibold text-[#211E1A]">Evidence mix</p>
      <p className="mt-1 text-xs leading-5 text-[#7A776C]">Types of sources supporting the analysis</p>
      <div className="mt-4 space-y-3">
        {rows.length > 0 ? rows.map(([type, count]) => (
          <div key={type}>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-[#58554C]">{SOURCE_LABELS[type] || type.replaceAll("_", " ")}</span>
              <span className="font-medium text-[#211E1A]">{count}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#ECEDE8]">
              <div className="h-full rounded-full bg-[#527267]" style={{ width: `${(count / maximum) * 100}%` }} />
            </div>
          </div>
        )) : <p className="text-sm text-[#7A776C]">No source metadata available.</p>}
      </div>
    </div>
  );
}


function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


export default function StrategicReport({ report }) {
  if (!report) return null;

  const purpose = report.purpose_specific_analysis || {};
  const limitations = uniqueItems([
    ...(report.confidence_assessment?.limitations || []),
    ...(report.missing_information || []),
    ...(report.quality_warnings || []),
  ]);
  const sources = report.sources_used || [];
  const findings = report.important_findings || [];
  const opportunities = report.opportunities || [];
  const risks = report.risks || [];

  function downloadPDF() {
    const previousTitle = document.title;
    const safeName = `${report.company_name || "business"} research report`.replace(/[^a-z0-9 ]/gi, "").trim();
    document.title = safeName || "business research report";
    window.addEventListener("afterprint", () => { document.title = previousTitle; }, { once: true });
    window.print();
  }

  return (
    <article className="report-page report-print-root mt-10 overflow-hidden rounded-2xl border border-[#CFD4CC] bg-[#F7F8F4] shadow-[0_24px_70px_rgba(38,47,40,0.10)]">
      <header className="relative overflow-hidden bg-[#203C34] px-6 py-8 text-white sm:px-10 sm:py-11">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -right-8 -top-14 h-44 w-44 rounded-full bg-white/5" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8D8CF]">Business intelligence report</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{report.title}</h2>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#D6E1DB]">
              <span>{report.company_name}</span><span className="h-1 w-1 rounded-full bg-[#8FB09D]" />
              <span>{PURPOSE_LABELS[report.purpose] || "Business research"}</span><span className="h-1 w-1 rounded-full bg-[#8FB09D]" />
              <span>{sources.length} cited sources</span>
            </div>
          </div>
          <button type="button" onClick={downloadPDF} className="report-no-print inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#203C34] transition hover:bg-[#EFF5F1]">
            <DownloadIcon /> Download PDF
          </button>
        </div>
      </header>

      <div className="px-5 py-7 sm:px-9 sm:py-9">
        <section className="report-break-avoid rounded-2xl border border-[#D7DDD5] bg-white p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#527267]">Executive overview</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#211E1A]">{report.executive_summary?.title || "What you should know"}</h3>
          <p className="mt-4 whitespace-pre-line text-base leading-7 text-[#514F48]">{report.executive_summary?.analysis}</p>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryMetric label="Key findings" value={findings.length} description="Important business observations" tone="accent" />
          <SummaryMetric label="Opportunities" value={opportunities.length} description="Potential favorable factors" tone="positive" />
          <SummaryMetric label="Risks" value={risks.length} description="Areas requiring attention" tone="caution" />
          <SummaryMetric label="Sources" value={sources.length} description="Evidence references used" />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <OpportunityRiskChart opportunities={opportunities} risks={risks} />
          <SourceMixChart sources={sources} />
        </section>

        <div className="mt-10 space-y-11">
          <InsightGroup eyebrow="Business picture" title="Important findings" description="The most important evidence-backed observations from the research." insights={findings} columns />
          <div className="grid gap-8 lg:grid-cols-2">
            <InsightGroup eyebrow="Upside" title="Opportunities" insights={opportunities} tone="positive" />
            <InsightGroup eyebrow="Watch list" title="Risks" insights={risks} tone="critical" />
          </div>

          <section className="report-section rounded-2xl border border-[#CDD8D0] bg-[#EDF3EF] p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#527267]">Analysis for your goal</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#211E1A]">Purpose-specific assessment</h3>
            {purpose.focus && <p className="mt-3 text-sm leading-6 text-[#585E58]">{purpose.focus}</p>}
            <div className="mt-7 space-y-8">
              <InsightGroup title="Key considerations" insights={purpose.key_considerations} />
              <div className="grid gap-8 lg:grid-cols-2">
                <InsightGroup title="Favorable case" insights={purpose.favorable_case} tone="positive" />
                <InsightGroup title="Caution case" insights={purpose.caution_case} tone="caution" />
              </div>
              <InsightGroup title="Decision factors" insights={purpose.decision_factors} columns />
            </div>
          </section>

          <section className="report-break-avoid rounded-2xl bg-[#262B27] p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#AFC2B6]">Bottom line</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{report.balanced_conclusion?.title || "Balanced conclusion"}</h3>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#E3E8E4]">{report.balanced_conclusion?.analysis}</p>
          </section>

          {report.questions_for_further_investigation?.length > 0 && (
            <section className="report-section">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6F786C]">Next steps</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#211E1A]">Questions to investigate next</h3>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {report.questions_for_further_investigation.map((question, index) => (
                  <div key={question} className="report-break-avoid flex gap-3 rounded-xl border border-[#D7D9D0] bg-white p-4">
                    <span className="font-semibold text-[#527267]">{String(index + 1).padStart(2, "0")}</span>
                    <p className="text-sm leading-6 text-[#58554C]">{question}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {limitations.length > 0 && (
            <section className="report-break-avoid rounded-2xl border border-[#E3D3B5] bg-[#FFF9EE] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A6429]">Before making a decision</p>
              <h3 className="mt-1 text-xl font-semibold text-[#30291F]">Information that still needs validation</h3>
              <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#665A48] lg:grid-cols-2">
                {limitations.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-[#B37A25]">•</span><span>{item}</span></li>)}
              </ul>
            </section>
          )}

          {sources.length > 0 && (
            <section className="report-section">
              <details className="rounded-xl border border-[#D7D9D0] bg-white p-5 text-sm">
                <summary className="cursor-pointer select-none font-semibold text-[#29483F]">Review all sources ({sources.length})</summary>
                <div className="mt-4 divide-y divide-[#E4E5DF]">
                  {sources.map((source) => (
                    <div key={source.evidence_id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        {source.url ? <a href={source.url} target="_blank" rel="noreferrer" className="font-medium text-[#365A50] underline decoration-[#365A50]/25 underline-offset-2">{source.title}</a> : <span className="font-medium text-[#211E1A]">{source.title}</span>}
                        <p className="mt-1 text-xs text-[#8A8778]">{source.evidence_id}</p>
                      </div>
                      <span className="shrink-0 text-xs text-[#7A776C]">{SOURCE_LABELS[source.source_type] || source.source_type?.replaceAll("_", " ")}</span>
                    </div>
                  ))}
                </div>
              </details>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
