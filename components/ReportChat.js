"use client";

import { useEffect, useRef, useState } from "react";
import { postJSON } from "@/lib/apiClient";

const STARTERS = ["Summarise the key risks", "What information is missing?", "What customer concerns are reported?"];

function safeURL(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

export default function ReportChat({ report }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState("");
  const [error, setError] = useState("");
  const [retryQuestion, setRetryQuestion] = useState("");
  const chunks = useRef(null);
  const controller = useRef(null);
  const busy = useRef(false);
  const timer = useRef(null);
  const end = useRef(null);
  const closeButton = useRef(null);
  const launcher = useRef(null);

  useEffect(() => {
    timer.current = setTimeout(() => setOpen(true), 10000);
    return () => {
      clearTimeout(timer.current);
      controller.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (open) end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, phase, open]);

  function toggle(next) {
    clearTimeout(timer.current);
    setOpen(next);
    if (next) requestAnimationFrame(() => closeButton.current?.focus());
    else requestAnimationFrame(() => launcher.current?.focus());
  }

  async function send(question = draft) {
    question = question.trim();
    if (question.length < 3 || question.length > 500 || busy.current) return;
    busy.current = true;
    const abort = new AbortController();
    controller.current = abort;
    setError("");
    setRetryQuestion("");
    setDraft("");
    setMessages((previous) => [...previous, { role: "user", content: question }]);
    try {
      if (!chunks.current) {
        setPhase("Preparing this report for questions…");
        const preview = await postJSON("/api/rag/chunks/preview", { report }, { signal: abort.signal });
        if (!Array.isArray(preview?.chunks) || !preview.chunks.length) throw new Error("This report has no searchable sections yet.");
        if (preview.chunks.length > 50) throw new Error("This report exceeds the chat service's current 50-section limit.");
        chunks.current = preview.chunks;
      }
      setPhase("Reading relevant sections and preparing your answer…");
      const result = await postJSON("/api/rag/answer/preview", {
        question,
        chunks: chunks.current,
        top_k: 3,
        conversation_history: messages.slice(-6).map(({ role, content }) => ({ role, content: content.slice(0, 3000) })),
      }, { signal: abort.signal });
      if (!result?.answer) throw new Error("The chat service returned an empty answer. Please try again.");
      setMessages((previous) => [...previous, { role: "assistant", content: result.answer, result }]);
    } catch (failure) {
      if (!abort.signal.aborted) {
        // Remove the failed turn so retries and follow-up history stay clean.
        setMessages((previous) => previous.slice(0, -1));
        setDraft(question);
        setRetryQuestion(question);
        setError(failure.status === 429
          ? "Chat capacity is temporarily busy. Please wait a moment, then retry. Your report is safe."
          : failure.message || "Could not reach the chat service. Please retry.");
      }
    } finally {
      busy.current = false;
      if (!abort.signal.aborted) setPhase("");
    }
  }

  return (
    <div className="report-no-print print:hidden">
      <button ref={launcher} type="button" aria-expanded={open} aria-controls="report-chat-panel"
        onClick={() => toggle(!open)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-[#29483F] px-6 py-4 text-sm font-semibold text-white shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4">
        {open ? "Close report chat" : "Ask about this report"}
      </button>
      {open && (
        <aside id="report-chat-panel" aria-label="Chat about this report"
          onKeyDown={(event) => { if (event.key === "Escape") toggle(false); }}
          className="fixed inset-0 z-50 flex flex-col bg-[#FAFAF8] shadow-2xl sm:inset-auto sm:bottom-24 sm:right-6 sm:top-6 sm:w-[410px] sm:max-w-[calc(100vw-3rem)] sm:rounded-2xl sm:border sm:border-[#D7D9D0]">
          <header className="flex items-start justify-between gap-3 border-b border-[#D7D9D0] p-5">
            <div><p className="text-xs font-semibold uppercase tracking-widest text-[#56715D]">Report companion</p>
              <h2 className="mt-1 text-lg font-semibold text-[#211E1A]">Let’s explore your report</h2>
              <p className="mt-1 text-xs text-[#6E7068]">{report.company_name} · This report only</p></div>
            <button ref={closeButton} type="button" onClick={() => toggle(false)} aria-label="Close report chat" className="rounded-lg px-3 py-2 text-xl hover:bg-[#E9ECE6]">×</button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {!messages.length && <div className="mb-6 rounded-xl border border-[#D7D9D0] bg-white p-4">
              <p className="text-sm leading-6">Have questions? Ask me about this report. I’ll use its findings and tell you when information is missing.</p>
              <div className="mt-4 flex flex-col gap-2">{STARTERS.map((question) => <button key={question} type="button" disabled={!!phase} onClick={() => send(question)} className="rounded-lg border border-[#D7D9D0] p-3 text-left text-xs text-[#29483F] hover:bg-[#F0F3EE] disabled:opacity-50">{question} ↗</button>)}</div>
            </div>}
            <div role="log" aria-label="Report conversation" aria-live="polite" aria-relevant="additions" className="space-y-4">
              {messages.map((message, index) => <article key={index} className={`rounded-xl p-4 text-sm leading-6 ${message.role === "user" ? "ml-8 bg-[#29483F] text-white" : "border border-[#D7D9D0] bg-white text-[#211E1A]"}`}>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-60">{message.role === "user" ? "You" : "Report companion"}</p>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                {!!message.result?.limitations?.length && <p className="mt-3 border-t border-[#D7D9D0] pt-3 text-xs text-[#74664E]">{message.result.limitations.join(" ")}</p>}
                {!!message.result?.supporting_chunks?.length && <details className="mt-3 text-xs"><summary className="cursor-pointer text-[#365A50]">Supporting report sections</summary><ul className="mt-2 space-y-1">{message.result.supporting_chunks.map(({ chunk }) => <li key={chunk.chunk_id}>{chunk.title}</li>)}</ul></details>}
                {!!message.result?.sources?.length && <ul className="mt-3 space-y-1 text-xs">{message.result.sources.map((source) => {
                  const url = safeURL(source.url);
                  return url ? <li key={source.evidence_id}><a href={url} target="_blank" rel="noopener noreferrer" className="text-[#365A50] underline">{source.title} ↗</a></li> : null;
                })}</ul>}
              </article>)}
            </div>
            {phase && <p role="status" className="mt-4 text-xs text-[#56715D]">{phase}</p>}
            {error && <div role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800"><p>{error}</p><button type="button" onClick={() => send(retryQuestion)} className="mt-2 underline">Retry question</button></div>}
            <div ref={end} />
          </div>
          <form onSubmit={(event) => { event.preventDefault(); send(); }} className="border-t border-[#D7D9D0] p-4">
            <label htmlFor="report-chat-question" className="sr-only">Question about this report</label>
            <textarea id="report-chat-question" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={500} rows={2} disabled={!!phase} placeholder="Ask a question about this report…" className="w-full resize-none rounded-xl border border-[#D7D9D0] bg-white p-3 text-sm focus:outline-[#56715D] disabled:opacity-60" />
            <div className="mt-2 flex items-center justify-between gap-3"><p className="text-[10px] text-[#6E7068]">Chat lasts for this report session.<br />AI answers can be wrong; check the sources.</p><button type="submit" disabled={!!phase || draft.trim().length < 3} className="rounded-lg bg-[#29483F] px-4 py-2 text-sm text-white disabled:opacity-40">{phase ? "Reading…" : "Send"}</button></div>
          </form>
        </aside>
      )}
    </div>
  );
}
