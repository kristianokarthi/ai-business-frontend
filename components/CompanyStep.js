import { COMPANY_EXAMPLES } from "@/lib/Purposeconfig";

export default function CompanyStep({ value, onChange, onNext }) {
  const canContinue = value.trim().length > 0;

  return (
    <div>
      <h2 className="font-['Source_Serif_4'] text-2xl text-[#211E1A] mb-2">
        Which company or business would you like to analyse?
      </h2>
      <p className="text-[#58554C] text-sm mb-5 max-w-[52ch]">
        Enter a company name, or describe your request in your own words.
        We'll pull out the company, location, and any competitors you
        mention.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Coca-Cola, or: Analyse Lenskart because I'm considering starting a similar eyewear business in Chennai."
        className="w-full resize-none rounded-sm border border-[#D7D9D0] bg-[#FAFAF8] px-4 py-3 text-[#211E1A] placeholder:text-[#A6A395] focus:outline-none focus:ring-2 focus:ring-[#A67C27]/40 focus:border-[#A67C27]"
      />

      <div className="flex flex-wrap gap-2 mt-3">
        {COMPANY_EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => onChange(ex)}
            className="text-xs text-[#58554C] border border-[#D7D9D0] rounded-full px-3 py-1.5 hover:border-[#A67C27] hover:text-[#211E1A] transition-colors"
          >
            {ex.length > 40 ? ex.slice(0, 40) + "\u2026" : ex}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className="bg-[#211E1A] text-[#EFF1EC] text-sm font-medium px-6 py-2.5 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3a352c] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}