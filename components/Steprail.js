const STEPS = [
  { n: 1, label: "Company" },
  { n: 2, label: "Purpose" },
  { n: 3, label: "Website" },
  { n: 4, label: "Report depth" },
  { n: 5, label: "Refine" },
];

export default function StepRail({ currentStep }) {
  return (
    <nav
      aria-label="Progress"
      className="flex md:flex-col gap-0 md:gap-0 md:w-48 md:shrink-0 md:pr-8 md:border-r md:border-[#D7D9D0] overflow-x-auto md:overflow-visible"
    >
      {STEPS.map((step, i) => {
        const isDone = step.n < currentStep;
        const isCurrent = step.n === currentStep;
        return (
          <div
            key={step.n}
            className="flex md:flex-row items-start md:items-center gap-3 py-3 md:py-4 pr-6 md:pr-0 shrink-0"
          >
            <span
              className={[
                "flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium shrink-0 font-['IBM_Plex_Mono']",
                isCurrent
                  ? "bg-[#211E1A] text-[#EFF1EC]"
                  : isDone
                  ? "bg-[#3D6B4F] text-[#EFF1EC]"
                  : "bg-transparent text-[#8A8778] border border-[#D7D9D0]",
              ].join(" ")}
            >
              {isDone ? (
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
                  <path
                    d="M3 8.5L6.2 11.5L13 4.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step.n
              )}
            </span>
            <span
              className={[
                "text-sm whitespace-nowrap md:whitespace-normal",
                isCurrent
                  ? "text-[#211E1A] font-medium"
                  : "text-[#8A8778]",
              ].join(" ")}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}