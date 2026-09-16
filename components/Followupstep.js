export default function FollowUpStep({
  questions,
  answers,
  onChange,
  onSubmit,
  onBack,
  submitting,
}) {
  return (
    <div>
      <h2 className="mb-2 text-2xl text-[#211E1A]">
        Refine the research
      </h2>

      <p className="mb-5 max-w-[52ch] text-sm text-[#58554C]">
        These answers are optional. They help the agent team focus the
        research without changing its evidence rules.
      </p>

      <div className="space-y-5">
        {questions.map((question) => (
          <div key={question.id}>
            <label
              htmlFor={question.id}
              className="mb-1.5 block text-sm text-[#211E1A]"
            >
              {question.question}
            </label>

            {question.options.length > 0 ? (
              <select
                id={question.id}
                value={answers[question.id] || ""}
                onChange={(event) =>
                  onChange(question.id, event.target.value)
                }
                className="w-full rounded-sm border border-[#D7D9D0] bg-[#FAFAF8] px-4 py-2.5 text-sm text-[#211E1A] focus:border-[#A67C27] focus:outline-none focus:ring-2 focus:ring-[#A67C27]/40"
              >
                <option value="">Skip this question</option>
                {question.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={question.id}
                type="text"
                value={answers[question.id] || ""}
                onChange={(event) =>
                  onChange(question.id, event.target.value)
                }
                placeholder={
                  question.placeholder || "Skip if unsure"
                }
                className="w-full rounded-sm border border-[#D7D9D0] bg-[#FAFAF8] px-4 py-2.5 text-sm text-[#211E1A] placeholder:text-[#A6A395] focus:border-[#A67C27] focus:outline-none focus:ring-2 focus:ring-[#A67C27]/40"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="px-4 py-2.5 text-sm text-[#58554C] transition-colors hover:text-[#211E1A] disabled:opacity-40"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-sm bg-[#211E1A] px-6 py-2.5 text-sm font-medium text-[#EFF1EC] transition-colors hover:bg-[#3a352c] disabled:opacity-60"
        >
          {submitting ? "Starting research…" : "Start analysis"}
        </button>
      </div>
    </div>
  );
}
