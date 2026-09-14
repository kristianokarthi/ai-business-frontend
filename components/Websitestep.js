function isValidWebsite(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}


export default function WebsiteStep({
  value,
  onChange,
  onNext,
  onBack,
}) {
  const canContinue = isValidWebsite(value.trim());

  return (
    <div>
      <h2 className="mb-2 text-2xl text-[#211E1A]">
        Add the official company website
      </h2>

      <p className="mb-5 max-w-[52ch] text-sm text-[#58554C]">
        Agent 1 currently reads the official homepage as its evidence
        source. Automatic website discovery will be added later.
      </p>

      <input
        type="url"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://www.example.com"
        aria-describedby="website-help"
        className="w-full rounded-sm border border-[#D7D9D0] bg-[#FAFAF8] px-4 py-3 text-[#211E1A] placeholder:text-[#A6A395] focus:border-[#A67C27] focus:outline-none focus:ring-2 focus:ring-[#A67C27]/40"
      />

      <p id="website-help" className="mt-2 text-xs text-[#8A8778]">
        Required for the current MVP. Use the complete URL, including
        https://.
      </p>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 text-sm text-[#58554C] transition-colors hover:text-[#211E1A]"
        >
          Back
        </button>

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
