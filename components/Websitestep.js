export default function WebsiteStep({ value, onChange, onNext, onBack }) {
  return (
    <div>
      <h2 className="font-['Source_Serif_4'] text-2xl text-[#211E1A] mb-2">
        Official company website
      </h2>
      <p className="text-[#58554C] text-sm mb-5 max-w-[52ch]">
        Optional, but it helps us tell the real company apart from a
        distributor, reseller, or unrelated business with a similar name.
      </p>

      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://www.example.com"
        className="w-full rounded-sm border border-[#D7D9D0] bg-[#FAFAF8] px-4 py-3 text-[#211E1A] placeholder:text-[#A6A395] focus:outline-none focus:ring-2 focus:ring-[#A67C27]/40 focus:border-[#A67C27]"
      />

      <p className="text-[#8A8778] text-xs mt-2">
        Leave this blank and we'll try to find it ourselves, then confirm
        with you before research begins.
      </p>

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
          onClick={onNext}
          className="bg-[#211E1A] text-[#EFF1EC] text-sm font-medium px-6 py-2.5 rounded-sm hover:bg-[#3a352c] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}