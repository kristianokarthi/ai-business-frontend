"use client";

import { useState } from "react";

import AnalysisProgress from "@/components/AnalysisProgress";
import CompanyStep from "@/components/CompanyStep";
import FollowUpStep from "@/components/Followupstep";
import PurposeStep from "@/components/Purposestep";
import StepRail from "@/components/Steprail";
import WebsiteStep from "@/components/Websitestep";
import useAnalysisWorkflow from "@/hooks/useAnalysisWorkflow";
import { FOLLOW_UP_QUESTIONS } from "@/lib/Purposeconfig";


const INITIAL_FORM = {
  companyName: "",
  purpose: "",
  website: "",
  followUpAnswers: {},
};


export default function Page() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const { workflow, run, retryFailed, reset } = useAnalysisWorkflow();

  function update(patch) {
    setForm((current) => ({
      ...current,
      ...patch,
    }));
  }

  function selectPurpose(purpose) {
    update({
      purpose,
      followUpAnswers: {},
    });
  }

  function updateFollowUp(questionId, value) {
    setForm((current) => ({
      ...current,
      followUpAnswers: {
        ...current.followUpAnswers,
        [questionId]: value,
      },
    }));
  }

  async function handleSubmit() {
    setStep(5);
    await run(form);
  }

  function startOver() {
    setForm(INITIAL_FORM);
    reset();
    setStep(1);
  }

  const questions = FOLLOW_UP_QUESTIONS[form.purpose] || [];

  return (
    <main className="min-h-screen bg-[#EFF1EC]">
      <header className="border-b border-[#D7D9D0] px-6 py-5 md:px-10">
        <p className="text-xl text-[#211E1A]">
          VentureLens AI
        </p>
        <p className="mt-0.5 text-xs text-[#8A8778]">
          Evidence-backed multi-agent business research
        </p>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-14">
        {step <= 4 && (
          <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            <StepRail currentStep={step} />

            <div className="min-w-0 flex-1">
              {step === 1 && (
                <CompanyStep
                  value={form.companyName}
                  onChange={(value) =>
                    update({ companyName: value })
                  }
                  onNext={() => setStep(2)}
                />
              )}

              {step === 2 && (
                <PurposeStep
                  value={form.purpose}
                  onChange={selectPurpose}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}

              {step === 3 && (
                <WebsiteStep
                  value={form.website}
                  onChange={(value) =>
                    update({ website: value })
                  }
                  onNext={() => setStep(4)}
                  onBack={() => setStep(2)}
                />
              )}

              {step === 4 && (
                <FollowUpStep
                  questions={questions}
                  answers={form.followUpAnswers}
                  onChange={updateFollowUp}
                  onSubmit={handleSubmit}
                  onBack={() => setStep(3)}
                  submitting={workflow.status === "running"}
                />
              )}
            </div>
          </div>
        )}

        {step === 5 && (
          <AnalysisProgress
            workflow={workflow}
            companyName={form.companyName}
            onRetry={retryFailed}
            onStartOver={startOver}
          />
        )}
      </div>
    </main>
  );
}
