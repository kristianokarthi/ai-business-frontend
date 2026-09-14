"use client";

import { useState } from "react";
import StepRail from "@/components/Steprail";
import CompanyStep from "@/components/CompanyStep";
import PurposeStep from "@/components/Purposestep";
import WebsiteStep from "@/components/Websitestep";
import DepthStep from "@/components/Depthstep";
import FollowUpStep from "@/components/Followupstep";
import ResultsView from "@/components/Resultsview";
import { runFactFinder } from "@/lib/Factfinder";

const INITIAL_FORM = {
  companyRequest: "",
  purpose: "",
  website: "",
  depth: "",
  followUpAnswers: {},
};

export default function Page() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function updateFollowUp(index, value) {
    setForm((f) => ({
      ...f,
      followUpAnswers: { ...f.followUpAnswers, [index]: value },
    }));
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const result = await runFactFinder({
        companyName: form.companyRequest,
        officialWebsite: form.website,
        purpose: form.purpose,
        followUpAnswers: form.followUpAnswers,
      });
      setResponse(result);
      setStep(6);
    } catch (err) {
      setError(err.message || "Something went wrong reaching the research agent.");
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    setForm(INITIAL_FORM);
    setResponse(null);
    setError(null);
    setStep(1);
  }

  return (
    <main className="min-h-screen bg-[#EFF1EC]">
      <header className="border-b border-[#D7D9D0] px-6 md:px-10 py-5">
        <p className="font-['Source_Serif_4'] text-xl text-[#211E1A]">
          VentureLens AI
        </p>
        <p className="text-[#8A8778] text-xs mt-0.5">
          Evidence-backed business research, built for your reason for
          asking.
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-14">
        {step <= 5 && (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <StepRail currentStep={step} />

            <div className="flex-1 min-w-0">
              {error && (
                <div className="mb-5 text-sm text-[#9B3B33] border border-[#9B3B33]/30 bg-[#9B3B33]/5 rounded-sm px-4 py-3">
                  {error}
                </div>
              )}

              {step === 1 && (
                <CompanyStep
                  value={form.companyRequest}
                  onChange={(v) => update({ companyRequest: v })}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <PurposeStep
                  value={form.purpose}
                  onChange={(v) => update({ purpose: v })}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <WebsiteStep
                  value={form.website}
                  onChange={(v) => update({ website: v })}
                  onNext={() => setStep(4)}
                  onBack={() => setStep(2)}
                />
              )}
              {step === 4 && (
                <DepthStep
                  value={form.depth}
                  onChange={(v) => update({ depth: v })}
                  onNext={() => setStep(5)}
                  onBack={() => setStep(3)}
                />
              )}
              {step === 5 && (
                <FollowUpStep
                  purpose={form.purpose}
                  answers={form.followUpAnswers}
                  onChange={updateFollowUp}
                  onSubmit={handleSubmit}
                  onBack={() => setStep(4)}
                  submitting={submitting}
                />
              )}
            </div>
          </div>
        )}

        {step === 6 && (
          <ResultsView response={response} onStartOver={startOver} />
        )}
      </div>
    </main>
  );
}