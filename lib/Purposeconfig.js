export const PURPOSES = [
  {
    id: "general_research",
    label: "General company research",
    description:
      "Understand what the company does, how it operates, and where information is missing.",
  },
  {
    id: "start_similar_business",
    label: "Start a similar business",
    description:
      "Gather evidence that later agents can use to study the business model and entry requirements.",
  },
  {
    id: "partner_or_supplier",
    label: "Partner or become a supplier",
    description:
      "Gather company and operating evidence relevant to a possible business relationship.",
  },
  {
    id: "stock_research",
    label: "Research its public stock",
    description:
      "Gather verifiable company facts for later financial and risk analysis.",
  },
];


export const FOLLOW_UP_QUESTIONS = {
  general_research: [
    {
      id: "target_location",
      question: "Which country or city should we focus on?",
      options: ["Worldwide", "India", "Other"],
      placeholder: "Example: Chennai",
    },
    {
      id: "product_focus",
      question:
        "Is there a specific product or service you want us to focus on?",
      options: [],
      placeholder: "Example: Beverages",
    },
    {
      id: "priority_area",
      question: "What would you like to understand most?",
      options: [
        "Customers",
        "Employees",
        "Finances",
        "Competitors",
        "Everything",
      ],
      placeholder: "",
    },
  ],
  start_similar_business: [
    {
      id: "target_location",
      question: "Where are you planning to start this business?",
      options: [],
      placeholder: "Example: Chennai",
    },
    {
      id: "investment_amount",
      question: "How much are you planning to invest approximately?",
      options: [
        "Below ₹5 lakh",
        "₹5–20 lakh",
        "₹20–50 lakh",
        "Above ₹50 lakh",
        "Not decided",
      ],
      placeholder: "",
    },
    {
      id: "business_type",
      question: "How will your business operate?",
      options: [
        "Online",
        "Physical location",
        "Both",
        "Not decided",
      ],
      placeholder: "",
    },
  ],
  partner_or_supplier: [
    {
      id: "offering",
      question:
        "What product or service would you like to offer this company?",
      options: [],
      placeholder: "Describe your product or service",
    },
    {
      id: "target_location",
      question: "Where would you like to work with this company?",
      options: [],
      placeholder: "Example: South India",
    },
    {
      id: "relationship_type",
      question: "How would you like to work with this company?",
      options: [
        "Supplier",
        "Distributor",
        "Technology provider",
        "Business partner",
        "Not sure",
      ],
      placeholder: "",
    },
  ],
  stock_research: [
    {
      id: "holding_period",
      question: "How long are you planning to hold this investment?",
      options: [
        "Less than 1 year",
        "1–3 years",
        "More than 3 years",
        "Not decided",
      ],
      placeholder: "",
    },
    {
      id: "risk_level",
      question: "How much investment risk are you comfortable with?",
      options: ["Low", "Medium", "High", "Not sure"],
      placeholder: "",
    },
    {
      id: "investment_priority",
      question: "What matters most to you?",
      options: [
        "Company growth",
        "Regular dividends",
        "Financial stability",
        "Current share price",
        "Everything",
      ],
      placeholder: "",
    },
  ],
};


export const COMPANY_EXAMPLES = [
  "Coca-Cola",
  "Lenskart",
  "Zoho",
];
