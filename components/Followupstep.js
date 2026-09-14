import { FOLLOW_UP_QUESTIONS } from "@/lib/Purposeconfig";

export default function FollowUpStep({
  purpose,
  answers,
  onChange,
  onSubmit,
  onBack,
  submitting,
}) {
  const questions = FOLLOW_UP_QUESTIONS[purpose] || [];

  return (
    <div>
      <h2 className="font-['Source_Serif_4'] text-2xl text-[#211E1A] mb-2">
        A few optional questions
      </h2>
      <p className="text-[#58554C] text-sm mb-5 max-w-[52ch]">
        Skip anything you're not sure about \u2014 unanswered questions become
        declared assumptions in the report rather than blockers.
      </p>

      <div className="space-y-5">
        {questions.map((q, i) => (
          <div key={i}>
            <label className="block text-sm text-[#211E1A] mb-1.5">
              {q}
            </label>
            <input
              type="text"
              value={answers[i] || ""}
              onChange={(e) => onChange(i, e.target.value)}
              placeholder="Skip if unsure"
              className="w-full rounded-sm border border-[#D7D9D0] bg-[#FAFAF8] px-4 py-2.5 text-sm text-[#211E1A] placeholder:text-[#A6A395] focus:outline-none focus:ring-2 focus:ring-[#A67C27]/40 focus:border-[#A67C27]"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="text-sm text-[#58554C] px-4 py-2.5 hover:text-[#211E1A] transition-colors disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="bg-[#211E1A] text-[#EFF1EC] text-sm font-medium px-6 py-2.5 rounded-sm hover:bg-[#3a352c] transition-colors disabled:opacity-60"
        >
          {submitting ? "Gathering evidence\u2026" : "Run analysis"}
        </button>
      </div>
    </div>
  );
}