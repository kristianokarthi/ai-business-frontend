import { COMPANY_EXAMPLES } from "@/lib/Purposeconfig";


export default function CompanyStep({
  value,
  onChange,
  onNext,
}) {
  const canContinue = value.trim().length >= 2;

  return (
    <div>
      <h2 className="mb-2 text-2xl text-[#211E1A]">
        Which company would you like to analyse?
      </h2>

      <p className="mb-5 max-w-[52ch] text-sm text-[#58554C]">
        Enter the company or brand name. The selected purpose will
        decide how later agents use the evidence.
      </p>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && canContinue) {
            onNext();
          }
        }}
        placeholder="Example: Coca-Cola"
        className="w-full rounded-sm border border-[#D7D9D0] bg-[#FAFAF8] px-4 py-3 text-[#211E1A] placeholder:text-[#A6A395] focus:border-[#A67C27] focus:outline-none focus:ring-2 focus:ring-[#A67C27]/40"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {COMPANY_EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onChange(example)}
            className="rounded-full border border-[#D7D9D0] px-3 py-1.5 text-xs text-[#58554C] transition-colors hover:border-[#A67C27] hover:text-[#211E1A]"
          >
            {example}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className="rounded-sm bg-[#211E1A] px-6 py-2.5 text-sm font-medium text-[#EFF1EC] transition-colors hover:bg-[#3a352c] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
