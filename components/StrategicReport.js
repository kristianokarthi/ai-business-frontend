function ConfidenceBadge({ value }) {
  if (!value) return null;

  return (
    <span className="rounded-full border border-[#B8B9B0] px-2 py-0.5 text-[11px] font-medium capitalize text-[#6D6A5E]">
      {value} confidence
    </span>
  );
}


function Insight({ insight }) {
  if (!insight) return null;

  return (
    <article className="rounded-md border border-[#D7D9D0] bg-white/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="font-medium text-[#211E1A]">{insight.title}</h4>
        <ConfidenceBadge value={insight.confidence} />
      </div>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#58554C]">
        {insight.analysis}
      </p>
      {insight.evidence_ids?.length > 0 && (
        <p className="mt-3 text-xs text-[#8A8778]">
          Evidence: {insight.evidence_ids.join(", ")}
        </p>
      )}
    </article>
  );
}


function InsightGroup({ title, insights }) {
  if (!insights?.length) return null;

  return (
    <section>
      <h3 className="text-lg font-medium text-[#211E1A]">{title}</h3>
      <div className="mt-3 grid gap-3">
        {insights.map((insight, index) => (
          <Insight key={`${title}-${insight.title}-${index}`} insight={insight} />
        ))}
      </div>
    </section>
  );
}


export default function StrategicReport({ report }) {
  if (!report) return null;

  const purpose = report.purpose_specific_analysis || {};
  const confidence = report.confidence_assessment || {};

  return (
    <section className="mt-8 rounded-lg border border-[#56715D]/30 bg-[#FAFAF8] p-5 shadow-sm sm:p-7">
      <div className="border-b border-[#D7D9D0] pb-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#56715D]">
          Agent 5 report
        </p>
        <h2 className="mt-2 text-2xl text-[#211E1A] sm:text-3xl">
          {report.title}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#6D6A5E]">
          <span>{report.word_count?.toLocaleString() || 0} words</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{confidence.overall_confidence || "unknown"} confidence</span>
          <span aria-hidden="true">·</span>
          <span>{report.sources_used?.length || 0} cited sources</span>
        </div>
      </div>

      <div className="mt-6 space-y-8">
        <section>
          <h3 className="text-lg font-medium text-[#211E1A]">
            {report.executive_summary?.title || "Executive summary"}
          </h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#58554C]">
            {report.executive_summary?.analysis}
          </p>
        </section>

        <InsightGroup title="Important findings" insights={report.important_findings} />
        <InsightGroup title="Opportunities" insights={report.opportunities} />
        <InsightGroup title="Risks" insights={report.risks} />

        <section>
          <h3 className="text-lg font-medium text-[#211E1A]">Purpose-specific analysis</h3>
          {purpose.focus && (
            <p className="mt-2 text-sm leading-6 text-[#58554C]">{purpose.focus}</p>
          )}
          <div className="mt-4 space-y-6">
            <InsightGroup title="Key considerations" insights={purpose.key_considerations} />
            <InsightGroup title="Favorable case" insights={purpose.favorable_case} />
            <InsightGroup title="Caution case" insights={purpose.caution_case} />
            <InsightGroup title="Decision factors" insights={purpose.decision_factors} />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-[#211E1A]">
            {report.balanced_conclusion?.title || "Balanced conclusion"}
          </h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#58554C]">
            {report.balanced_conclusion?.analysis}
          </p>
        </section>

        {report.questions_for_further_investigation?.length > 0 && (
          <section>
            <h3 className="text-lg font-medium text-[#211E1A]">Questions to investigate next</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#58554C]">
              {report.questions_for_further_investigation.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </section>
        )}

        <section className="rounded-md border border-[#A67C27]/25 bg-[#A67C27]/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-medium text-[#211E1A]">Confidence and limitations</h3>
            <ConfidenceBadge value={confidence.overall_confidence} />
          </div>
          <p className="mt-2 text-sm leading-6 text-[#58554C]">{confidence.rationale}</p>
          {confidence.limitations?.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#58554C]">
              {confidence.limitations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </section>

        {report.missing_information?.length > 0 && (
          <section>
            <h3 className="text-lg font-medium text-[#211E1A]">Missing information</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-[#58554C]">
              {report.missing_information.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {report.sources_used?.length > 0 && (
          <details className="rounded-md border border-[#D7D9D0] bg-white/60 p-4 text-sm">
            <summary className="cursor-pointer select-none font-medium text-[#3F5B47]">
              Sources used ({report.sources_used.length})
            </summary>
            <ul className="mt-3 space-y-2">
              {report.sources_used.map((source) => (
                <li key={source.evidence_id}>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#3F5B47] underline decoration-[#3F5B47]/30 underline-offset-2"
                    >
                      {source.title}
                    </a>
                  ) : source.title}
                  <span className="ml-1 text-xs text-[#8A8778]">
                    · {source.evidence_id}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}

        {report.quality_warnings?.length > 0 && (
          <section>
            <h3 className="text-sm font-medium text-[#8B312A]">Quality warnings</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#58554C]">
              {report.quality_warnings.map((warning) => <li key={warning}>{warning}</li>)}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
