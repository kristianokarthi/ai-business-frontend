function SourceTags({ ids }) {
  if (!ids || ids.length === 0) return null;
  return (
    <span className="inline-flex gap-1 ml-2 align-middle">
      {ids.map((id) => (
        <span
          key={id}
          className="font-['IBM_Plex_Mono'] text-[10px] text-[#A67C27] border border-[#A67C27]/40 rounded-sm px-1.5 py-0.5"
        >
          {id}
        </span>
      ))}
    </span>
  );
}

function Panel({ title, count, children }) {
  return (
    <section className="border border-[#D7D9D0] bg-[#FAFAF8] rounded-sm">
      <div className="flex items-baseline justify-between px-5 py-3 border-b border-[#D7D9D0]">
        <h3 className="font-['Source_Serif_4'] text-lg text-[#211E1A]">
          {title}
        </h3>
        {count !== undefined && (
          <span className="font-['IBM_Plex_Mono'] text-xs text-[#8A8778]">
            {count}
          </span>
        )}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export default function ResultsView({ response, onStartOver }) {
  const result = response?.result;
  const usage = response?.usage;

  if (!result) return null;

  const identity = result.company_identity || {};
  const facts = result.verified_facts || [];
  const claims = result.company_claims || [];
  const conflicts = result.conflicting_claims || [];
  const missing = result.missing_information || [];
  const sources = result.sources_used || [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-['IBM_Plex_Mono'] text-xs text-[#3D6B4F] mb-1">
            {result.status === "completed" ? "Evidence gathered" : result.status}
          </p>
          <h2 className="font-['Source_Serif_4'] text-3xl text-[#211E1A]">
            {identity.name || "Unknown company"}
          </h2>
          <p className="text-[#58554C] text-sm mt-1">
            {[identity.industry, identity.headquarters]
              .filter(Boolean)
              .join(" \u00b7 ")}
          </p>
        </div>
        <button
          type="button"
          onClick={onStartOver}
          className="shrink-0 text-sm text-[#58554C] border border-[#D7D9D0] rounded-sm px-4 py-2 hover:border-[#A67C27] hover:text-[#211E1A] transition-colors"
        >
          New analysis
        </button>
      </div>

      <Panel title="Verified facts" count={facts.length}>
        {facts.length === 0 ? (
          <p className="text-[#8A8778] text-sm">No verified facts yet.</p>
        ) : (
          <ul className="space-y-3">
            {facts.map((f) => (
              <li
                key={f.fact_id}
                className="text-sm text-[#211E1A] leading-relaxed border-l-2 border-[#3D6B4F] pl-3"
              >
                {f.statement}
                <SourceTags ids={f.source_ids} />
                {f.category && (
                  <span className="block text-[#8A8778] text-xs mt-0.5">
                    {f.category.replace(/_/g, " ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {claims.length > 0 && (
        <Panel title="Company-reported claims" count={claims.length}>
          <p className="text-[#8A8778] text-xs mb-3">
            Marketing or company statements, not independently verified.
          </p>
          <ul className="space-y-3">
            {claims.map((c, i) => (
              <li
                key={i}
                className="text-sm text-[#211E1A] leading-relaxed border-l-2 border-[#A67C27] pl-3"
              >
                {c.statement || c}
                <SourceTags ids={c.source_ids} />
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {conflicts.length > 0 && (
        <Panel title="Conflicting claims" count={conflicts.length}>
          <ul className="space-y-3">
            {conflicts.map((c, i) => (
              <li
                key={i}
                className="text-sm text-[#211E1A] leading-relaxed border-l-2 border-[#9B3B33] pl-3"
              >
                {typeof c === "string" ? c : JSON.stringify(c)}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title="Missing information" count={missing.length}>
        {missing.length === 0 ? (
          <p className="text-[#8A8778] text-sm">Nothing flagged as missing.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-2">
            {missing.map((m, i) => (
              <li
                key={i}
                className="text-sm text-[#58554C] border border-dashed border-[#D7D9D0] rounded-sm px-3 py-2"
              >
                {m}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Sources used" count={sources.length}>
        {sources.length === 0 ? (
          <p className="text-[#8A8778] text-sm">No sources recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <span
                key={s}
                className="font-['IBM_Plex_Mono'] text-xs text-[#58554C] border border-[#D7D9D0] rounded-sm px-2 py-1"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </Panel>

      {usage && (
        <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#A6A395] pt-2">
          {usage.agent_name} \u00b7 {usage.provider}/{usage.model} \u00b7{" "}
          {usage.total_tokens} tokens
        </p>
      )}
    </div>
  );
}