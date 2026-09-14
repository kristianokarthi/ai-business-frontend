const STEPS = [
  { number: 1, label: "Company" },
  { number: 2, label: "Purpose" },
  { number: 3, label: "Evidence source" },
  { number: 4, label: "Refine" },
];


export default function StepRail({ currentStep }) {
  return (
    <nav
      aria-label="Progress"
      className="flex overflow-x-auto md:w-48 md:shrink-0 md:flex-col md:overflow-visible md:border-r md:border-[#D7D9D0] md:pr-8"
    >
      {STEPS.map((step) => {
        const isDone = step.number < currentStep;
        const isCurrent = step.number === currentStep;

        return (
          <div
            key={step.number}
            className="flex shrink-0 items-start gap-3 py-3 pr-6 md:items-center md:py-4 md:pr-0"
          >
            <span
              className={[
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                isCurrent
                  ? "bg-[#211E1A] text-[#EFF1EC]"
                  : isDone
                    ? "bg-[#3D6B4F] text-[#EFF1EC]"
                    : "border border-[#D7D9D0] bg-transparent text-[#8A8778]",
              ].join(" ")}
            >
              {isDone ? (
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8.5L6.2 11.5L13 4.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step.number
              )}
            </span>

            <span
              className={[
                "whitespace-nowrap text-sm md:whitespace-normal",
                isCurrent
                  ? "font-medium text-[#211E1A]"
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
