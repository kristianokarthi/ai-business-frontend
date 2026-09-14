// Shared config: research purposes, their dynamic follow-up questions, and
// report depth options. Keeping these in one place means the form, the
// review screen, and the API payload all stay in sync.
//
// NOTE: confirm the exact `id` strings against the backend's OpenAPI enum
// for `purpose` (the docs example only shows "general_research") before
// wiring this to other agents.

export const PURPOSES = [
  {
    id: "general_research",
    label: "General company research",
    description:
      "Understand what the company does, how it competes, and how it's perceived.",
  },
  {
    id: "similar_business",
    label: "Start a similar business",
    description:
      "Learn the business model, entry barriers, and gaps you could exploit.",
  },
  {
    id: "partner_supplier",
    label: "Partner with the company or become a supplier",
    description:
      "Assess credibility, fit, and what a partnership might require.",
  },
  {
    id: "public_stock",
    label: "Research its public stock",
    description:
      "Review fundamentals, growth drivers, and risks for investment research.",
  },
];

export const FOLLOW_UP_QUESTIONS = {
  general_research: [
    "Which geographic market are you interested in?",
    "Is there a particular product, service, or business segment to focus on?",
    "Do you want customer, employee, financial, or competitive analysis prioritized?",
  ],
  similar_business: [
    "Which city, state, or country are you targeting?",
    "What is your approximate investment range?",
    "Are you planning an online, offline, or hybrid business?",
  ],
  partner_supplier: [
    "What product or service would you offer the company?",
    "Which region or market would the partnership cover?",
    "Are you evaluating a supplier relationship, strategic partnership, distribution relationship, or technology partnership?",
  ],
  public_stock: [
    "What is your expected investment time horizon: short, medium, or long term?",
    "What is your risk preference: conservative, balanced, or aggressive?",
    "Do you want to prioritize growth, income/dividends, financial stability, or valuation?",
  ],
};

export const REPORT_DEPTHS = [
  {
    id: "overview",
    label: "Overview report",
    readingTime: "7\u201310 min read",
    description:
      "A limited set of key sources. Major findings, competitors, sentiment, opportunities, and risks.",
  },
  {
    id: "deep",
    label: "Deep-analysis report",
    readingTime: "40\u201360 min read",
    description:
      "Broader source coverage. Detailed competitor, sentiment, financial, and scenario analysis.",
  },
];

export const COMPANY_EXAMPLES = [
  "Coca-Cola",
  "Analyse Coca-Cola's business and competitive position.",
  "Analyse Lenskart because I am considering starting a similar eyewear business in Chennai.",
];