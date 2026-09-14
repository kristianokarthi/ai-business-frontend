"use client";

import { useState } from "react";

import CompanyStep from "@/components/CompanyStep";
import FollowUpStep from "@/components/Followupstep";
import PurposeStep from "@/components/Purposestep";
import ResultsView from "@/components/Resultsview";
import StepRail from "@/components/Steprail";
import WebsiteStep from "@/components/Websitestep";
import { runFactFinder } from "@/lib/Factfinder";
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);

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
    setError("");
    setSubmitting(true);

    try {
      const result = await runFactFinder({
        companyName: form.companyName,
        officialWebsite: form.website,
        purpose: form.purpose,
        followUpAnswers: form.followUpAnswers,
      });

      setResponse(result);
      setStep(5);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Something went wrong while running the Fact Finder."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    setForm(INITIAL_FORM);
    setResponse(null);
    setError("");
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
          Agent 1: evidence-backed company fact finding
        </p>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-14">
        {step <= 4 && (
          <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            <StepRail currentStep={step} />

            <div className="min-w-0 flex-1">
              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-sm border border-[#9B3B33]/30 bg-[#9B3B33]/5 px-4 py-3 text-sm text-[#9B3B33]"
                >
                  {error}
                </div>
              )}

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
                  submitting={submitting}
                />
              )}
            </div>
          </div>
        )}

        {step === 5 && (
          <ResultsView
            response={response}
            onStartOver={startOver}
          />
        )}
      </div>
    </main>
  );
}
