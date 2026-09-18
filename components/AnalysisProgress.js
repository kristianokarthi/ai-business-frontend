import { AGENT_DEFINITIONS } from "@/hooks/useAnalysisWorkflow";
import StrategicReport from "@/components/StrategicReport";


const STATUS_LABELS = {
  pending: "Queued",
  running: "Working",
  completed: "Complete",
  insufficient_data: "Insufficient evidence",
  waiting_for_sources: "Waiting for sources",
  failed: "Needs attention",
};


const STATUS_STYLES = {
  pending: "border-[#D7D9D0] bg-[#FAFAF8] text-[#8A8778]",
  running: "border-[#A67C27]/50 bg-[#A67C27]/5 text-[#7A5919]",
  completed: "border-[#56715D]/35 bg-[#56715D]/5 text-[#3F5B47]",
  insufficient_data: "border-[#A67C27]/40 bg-[#A67C27]/5 text-[#7A5919]",
  waiting_for_sources: "border-[#8A8778]/30 bg-[#8A8778]/5 text-[#6D6A5E]",
  failed: "border-[#9B3B33]/35 bg-[#9B3B33]/5 text-[#8B312A]",
};


function formatDuration(agent) {
  if (!agent.startedAt || !agent.finishedAt) return null;
  const seconds = Math.max(1, Math.round((agent.finishedAt - agent.startedAt) / 1000));
  return `${seconds}s`;
}


function AgentIcon({ status }) {
  if (status === "completed") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#56715D] text-sm text-white">
        ✓
      </span>
    );
  }

  if (status === "running") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#D9C28D] border-t-[#A67C27]">
        <span className="sr-only">Running</span>
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9B3B33] text-sm text-white">
        !
      </span>
    );
  }

  if (status === "insufficient_data") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A67C27] text-sm text-white">
        ?
      </span>
    );
  }

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C8C9C0] bg-[#EFF1EC] text-xs text-[#8A8778]">
      •
    </span>
  );
}


function completionNote(id, result) {
  if (!result) return null;

  if (id === "factFinder") {
    const facts = result.verified_facts?.length || 0;
    return `${facts} verified ${facts === 1 ? "fact" : "facts"} collected`;
  }

  if (id === "businessFundamentals") {
    const findings = result.findings?.length || 0;
    return `${findings} business ${findings === 1 ? "finding" : "findings"} prepared`;
  }

  if (id === "marketCompetitor") {
    if (result.status === "insufficient_data") {
      return "The collected sources did not support a useful market analysis";
    }
    const competitors = result.competitors?.length || 0;
    return `${competitors} ${competitors === 1 ? "competitor" : "competitors"} analysed`;
  }

  if (id === "customerReputation") {
    const count = result.sample_size || 0;
    const sentiment = result.sentiment_summary?.classification || "unclear";
    return `${count} public ${count === 1 ? "signal" : "signals"} analysed · ${sentiment} sentiment`;
  }

  if (id === "reportStrategist") {
    return "Final research report prepared";
  }

  return null;
}


function CustomerResultPreview({ result }) {
  if (!result) return null;

  const summary = result.sentiment_summary || {};
  const themeSections = [
    ["Complaints", result.complaint_themes],
    ["Customer pain points", result.customer_pain_points],
    ["Unmet needs", result.unmet_needs],
    ["Reputation risks", result.reputation_risks],
  ].filter(([, themes]) => themes?.length > 0);

  const counts = [
    ["Positive", summary.positive_count],
    ["Negative", summary.negative_count],
    ["Neutral", summary.neutral_count],
    ["Mixed", summary.mixed_count],
    ["Unclear", summary.unclear_count],
  ];

  return (
    <details className="mt-3 rounded-sm border border-[#56715D]/20 bg-white/60 p-3 text-sm">
      <summary className="cursor-pointer select-none font-medium text-[#3F5B47]">
        View Agent 4 result
      </summary>
      <div className="mt-3 space-y-4 text-[#58554C]">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-[#8A8778]">Overall sentiment</p>
            <p className="mt-0.5 capitalize text-[#211E1A]">
              {summary.classification || "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8A8778]">Signals analysed</p>
            <p className="mt-0.5 text-[#211E1A]">{result.sample_size || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {counts.map(([label, value]) => (
            <div key={label} className="rounded-sm border border-[#D7D9D0] bg-[#FAFAF8] px-2 py-2 text-center">
              <p className="text-xs text-[#8A8778]">{label}</p>
              <p className="mt-0.5 font-medium text-[#211E1A]">{value || 0}</p>
            </div>
          ))}
        </div>

        {themeSections.map(([label, themes]) => (
          <div key={label}>
            <p className="text-xs uppercase tracking-[0.1em] text-[#8A8778]">
              {label}
            </p>
            <ul className="mt-1.5 space-y-1.5 text-[#211E1A]">
              {themes.map((theme) => (
                <li key={theme.theme_id} className="flex gap-2">
                  <span aria-hidden="true" className="text-[#A67C27]">•</span>
                  <span>{theme.statement}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {result.missing_information?.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-[#8A8778]">
              Evidence limitations
            </p>
            <ul className="mt-1.5 space-y-1 text-[#58554C]">
              {result.missing_information.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}


function MarketResultPreview({ result }) {
  if (!result) return null;

  const competitors = result.competitors || [];
  const findingCount = [
    ...(result.entry_barriers || []),
    ...(result.market_trends || []),
    ...(result.market_gaps || []),
    ...(result.competitive_risks || []),
  ].length;

  return (
    <details className="mt-3 rounded-sm border border-[#56715D]/20 bg-white/60 p-3 text-sm">
      <summary className="cursor-pointer select-none font-medium text-[#3F5B47]">
        View Agent 3 result
      </summary>
      <div className="mt-3 space-y-3 text-[#58554C]">
        <div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#8A8778]">
            Market
          </p>
          <p className="mt-1 text-[#211E1A]">
            {[result.market_definition?.industry, result.market_definition?.geographic_market]
              .filter(Boolean)
              .join(" · ") || "Not established"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#8A8778]">
            Competitors
          </p>
          <p className="mt-1 text-[#211E1A]">
            {competitors.length > 0
              ? competitors.map((competitor) => competitor.name).join(", ")
              : "No supported competitors identified"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-[#8A8778]">Market structure</p>
            <p className="mt-0.5 capitalize text-[#211E1A]">
              {result.market_structure?.classification || "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8A8778]">Market findings</p>
            <p className="mt-0.5 text-[#211E1A]">{findingCount}</p>
          </div>
        </div>
      </div>
    </details>
  );
}


function AgentCard({ definition, agent, onRetry }) {
  const duration = formatDuration(agent);
  const note = completionNote(definition.id, agent.result);
  const isFailed = agent.status === "failed";

  return (
    <li className={`rounded-md border p-4 ${STATUS_STYLES[agent.status]}`}>
      <div className="flex gap-3">
        <div className={agent.status === "running" ? "animate-spin" : ""}>
          <AgentIcon status={agent.status} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] opacity-75">
                {definition.label}
              </p>
              <h3 className="mt-0.5 text-base font-medium text-[#211E1A]">
                {definition.title}
              </h3>
            </div>
            <span className="rounded-full border border-current/20 px-2.5 py-1 text-xs font-medium">
              {STATUS_LABELS[agent.status]}
            </span>
          </div>

          <p className="mt-2 text-sm text-[#58554C]">
            {agent.status === "waiting_for_sources"
              ? "A verified evidence collector must be connected before this agent runs."
              : definition.activity}
          </p>

          {note && <p className="mt-2 text-sm font-medium">{note}</p>}

          {definition.id === "marketCompetitor" &&
            ["completed", "insufficient_data"].includes(agent.status) && (
              <MarketResultPreview result={agent.result} />
            )}

          {definition.id === "customerReputation" &&
            agent.status === "completed" && (
              <CustomerResultPreview result={agent.result} />
            )}

          {agent.status === "insufficient_data" && agent.error?.message && (
            <p className="mt-3 rounded-sm border border-[#A67C27]/20 bg-white/60 p-3 text-sm text-[#664B18]">
              {agent.error.message}
            </p>
          )}

          {isFailed && (
            <div className="mt-3 rounded-sm border border-[#9B3B33]/20 bg-white/60 p-3">
              <p className="text-sm text-[#8B312A]">{agent.error?.message}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 rounded-sm bg-[#211E1A] px-4 py-2 text-xs font-medium text-white hover:bg-[#3A352C]"
              >
                Retry this step
              </button>
            </div>
          )}

          {(agent.status === "running" || agent.usage || duration || agent.error) && (
            <details className="mt-3 text-xs text-[#6D6A5E]">
              <summary className="cursor-pointer select-none font-medium">
                Technical details
              </summary>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 rounded-sm bg-white/60 p-3 sm:grid-cols-4">
                <dt>Status</dt>
                <dd className="text-right text-[#211E1A]">
                  {agent.status === "running" ? "In progress" : STATUS_LABELS[agent.status]}
                </dd>
                {agent.usage?.provider && (
                  <>
                    <dt>Provider</dt>
                    <dd className="text-right text-[#211E1A]">{agent.usage.provider}</dd>
                  </>
                )}
                {agent.usage?.model && (
                  <>
                    <dt>Model</dt>
                    <dd className="break-all text-right text-[#211E1A]">{agent.usage.model}</dd>
                  </>
                )}
                {agent.usage?.input_tokens != null && (
                  <>
                    <dt>Input tokens</dt>
                    <dd className="text-right text-[#211E1A]">{agent.usage.input_tokens.toLocaleString()}</dd>
                  </>
                )}
                {agent.usage?.output_tokens != null && (
                  <>
                    <dt>Output tokens</dt>
                    <dd className="text-right text-[#211E1A]">{agent.usage.output_tokens.toLocaleString()}</dd>
                  </>
                )}
                {agent.collection?.usage?.credits_used != null && (
                  <>
                    <dt>Tavily credits</dt>
                    <dd className="text-right text-[#211E1A]">
                      {agent.collection.usage.credits_used}
                    </dd>
                  </>
                )}
                {agent.collection?.usage?.search_requests != null && (
                  <>
                    <dt>Web searches</dt>
                    <dd className="text-right text-[#211E1A]">
                      {agent.collection.usage.search_requests}
                    </dd>
                  </>
                )}
                {agent.collection?.usage?.selected_urls != null && (
                  <>
                    <dt>Sources selected</dt>
                    <dd className="text-right text-[#211E1A]">
                      {agent.collection.usage.selected_urls}
                    </dd>
                  </>
                )}
                {agent.collection?.usage?.extracted_documents != null && (
                  <>
                    <dt>Sources extracted</dt>
                    <dd className="text-right text-[#211E1A]">
                      {agent.collection.usage.extracted_documents}
                    </dd>
                  </>
                )}
                {agent.context?.estimated_tokens != null && (
                  <>
                    <dt>Report context</dt>
                    <dd className="text-right text-[#211E1A]">
                      {agent.context.estimated_tokens.toLocaleString()} tokens
                    </dd>
                  </>
                )}
                {agent.context?.evidence_source_count != null && (
                  <>
                    <dt>Evidence sources</dt>
                    <dd className="text-right text-[#211E1A]">
                      {agent.context.evidence_source_count}
                    </dd>
                  </>
                )}
                {agent.context?.truncated_for_budget != null && (
                  <>
                    <dt>Context trimmed</dt>
                    <dd className="text-right text-[#211E1A]">
                      {agent.context.truncated_for_budget ? "Yes" : "No"}
                    </dd>
                  </>
                )}
                {duration && (
                  <>
                    <dt>Duration</dt>
                    <dd className="text-right text-[#211E1A]">{duration}</dd>
                  </>
                )}
                {agent.error?.code && (
                  <>
                    <dt>Error code</dt>
                    <dd className="break-all text-right text-[#211E1A]">{agent.error.code}</dd>
                  </>
                )}
              </dl>
              {agent.collection?.market_documents?.length > 0 && (
                <div className="mt-2 rounded-sm bg-white/60 p-3">
                  <p className="font-medium text-[#58554C]">
                    Selected research sources
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {agent.collection.market_documents.map((source) => (
                      <li key={source.source_id}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#3F5B47] underline decoration-[#3F5B47]/30 underline-offset-2 hover:decoration-[#3F5B47]"
                        >
                          {source.title}
                        </a>
                        <span className="ml-1 text-[#8A8778]">
                          · {source.source_type.replace(/_/g, " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {agent.collection?.signal_documents?.length > 0 && (
                <div className="mt-2 rounded-sm bg-white/60 p-3">
                  <p className="font-medium text-[#58554C]">
                    Selected public-signal sources
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {agent.collection.signal_documents.map((source) => (
                      <li key={source.signal_id}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#3F5B47] underline decoration-[#3F5B47]/30 underline-offset-2 hover:decoration-[#3F5B47]"
                        >
                          {source.title}
                        </a>
                        <span className="ml-1 text-[#8A8778]">
                          · {source.source_type.replace(/_/g, " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </details>
          )}
        </div>
      </div>
    </li>
  );
}


export default function AnalysisProgress({
  workflow,
  companyName,
  onRetry,
  onStartOver,
}) {
  const completed = Object.values(workflow.agents).filter(
    (agent) => ["completed", "insufficient_data"].includes(agent.status)
  ).length;
  const totalTokens = Object.values(workflow.agents).reduce(
    (sum, agent) => sum + (agent.usage?.total_tokens || 0),
    0
  );
  const totalCredits = Object.values(workflow.agents).reduce(
    (sum, agent) => sum + (agent.collection?.usage?.credits_used || 0),
    0
  );
  const isRunning = workflow.status === "running";
  const reportIsReady = workflow.agents.reportStrategist.status === "completed";
  const marketIsLimited = workflow.agents.marketCompetitor.status ===
    "insufficient_data";
  const customerIsLimited = workflow.agents.customerReputation.status ===
    "insufficient_data";
  const hasLimitedEvidence = marketIsLimited || customerIsLimited;
  const heading = isRunning
    ? "Research in progress"
    : workflow.status === "failed"
      ? "Research paused"
      : hasLimitedEvidence
        ? "Research completed with limits"
        : "Research completed";

  return (
    <section aria-live="polite" className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 border-b border-[#D7D9D0] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8A8778]">
            {completed} of {AGENT_DEFINITIONS.length} agents finished
          </p>
          <h2 className="mt-2 text-3xl text-[#211E1A]">{heading}</h2>
          <p className="mt-2 text-sm text-[#58554C]">
            Analysing <span className="font-medium text-[#211E1A]">{companyName}</span>
          </p>
        </div>

        {!reportIsReady && (totalTokens > 0 || totalCredits > 0) && (
          <div className="flex gap-2">
            {totalTokens > 0 && (
              <div className="rounded-sm border border-[#D7D9D0] bg-[#FAFAF8] px-4 py-3 text-right">
                <p className="text-xs text-[#8A8778]">Tokens used</p>
                <p className="mt-0.5 text-lg font-medium text-[#211E1A]">
                  {totalTokens.toLocaleString()}
                </p>
              </div>
            )}
            {totalCredits > 0 && (
              <div className="rounded-sm border border-[#D7D9D0] bg-[#FAFAF8] px-4 py-3 text-right">
                <p className="text-xs text-[#8A8778]">Tavily credits</p>
                <p className="mt-0.5 text-lg font-medium text-[#211E1A]">
                  {totalCredits}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {!isRunning && workflow.status === "completed" && hasLimitedEvidence && (
        <div className="mt-6 rounded-md border border-[#A67C27]/30 bg-[#A67C27]/5 p-4 text-sm text-[#664B18]">
          The available public sources were insufficient for one or more analysis stages. Completed findings remain available with their evidence limitations.
        </div>
      )}

      {reportIsReady && (
        <StrategicReport report={workflow.agents.reportStrategist.result} />
      )}

      {reportIsReady ? (
        <details className="report-no-print mt-6 rounded-xl border border-[#D7D9D0] bg-[#FAFAF8] p-5">
          <summary className="cursor-pointer select-none font-medium text-[#3F5B47]">
            View research process and technical details
          </summary>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#7A776C]">
            <span>{totalTokens.toLocaleString()} AI tokens used</span>
            <span>{totalCredits} Tavily credits used</span>
          </div>
          <ol className="mt-5 space-y-3">
            {AGENT_DEFINITIONS.map((definition) => (
              <AgentCard
                key={definition.id}
                definition={definition}
                agent={workflow.agents[definition.id]}
                onRetry={onRetry}
              />
            ))}
          </ol>
        </details>
      ) : (
        <ol className="mt-6 space-y-3">
          {AGENT_DEFINITIONS.map((definition) => (
            <AgentCard
              key={definition.id}
              definition={definition}
              agent={workflow.agents[definition.id]}
              onRetry={onRetry}
            />
          ))}
        </ol>
      )}

      {!isRunning && (
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onStartOver}
            className="rounded-sm border border-[#B8B9B0] bg-[#FAFAF8] px-5 py-2.5 text-sm font-medium text-[#211E1A] hover:border-[#8A8778]"
          >
            Start new analysis
          </button>
        </div>
      )}
    </section>
  );
}
