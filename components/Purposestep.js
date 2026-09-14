import { PURPOSES } from "@/lib/Purposeconfig";

export default function PurposeStep({ value, onChange, onNext, onBack }) {
  return (
    <div>
      <h2 className="font-['Source_Serif_4'] text-2xl text-[#211E1A] mb-2">
        Why are you researching this company?
      </h2>
      <p className="text-[#58554C] text-sm mb-5 max-w-[52ch]">
        This decides which questions we ask next and how the final report is
        framed.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {PURPOSES.map((p) => {
          const selected = value === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              className={[
                "text-left rounded-sm border px-4 py-4 transition-colors",
                selected
                  ? "border-[#A67C27] bg-[#FAF6EC]"
                  : "border-[#D7D9D0] bg-[#FAFAF8] hover:border-[#B8B5A6]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#211E1A] font-medium text-sm">
                  {p.label}
                </span>
                <span
                  className={[
                    "mt-0.5 w-4 h-4 rounded-full border shrink-0",
                    selected
                      ? "border-[#A67C27] bg-[#A67C27]"
                      : "border-[#D7D9D0]",
                  ].join(" ")}
                />
              </div>
              <p className="text-[#58554C] text-xs mt-1.5 leading-relaxed">
                {p.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-[#58554C] px-4 py-2.5 hover:text-[#211E1A] transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!value}
          onClick={onNext}
          className="bg-[#211E1A] text-[#EFF1EC] text-sm font-medium px-6 py-2.5 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3a352c] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}