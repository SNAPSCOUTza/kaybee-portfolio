export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export const faqItems: FaqItem[] = [
  {
    id: "what-can-you-shoot",
    question: "What can you shoot?",
    answer:
      "Automotive, fashion, brand campaigns, events and social content — if it needs a camera, it's probably been shot. Where I really shine is creating visuals for the food and restaurant segment of the market, as well as the automotive space.",
    defaultOpen: true
  },
  {
    id: "only-cars",
    question: "Do you only shoot cars?",
    answer: "Cars are a big part of the portfolio, but the work spans fashion, corporate and campaign content too."
  },
  {
    id: "what-you-need",
    question: "What do you need from me?",
    answer: "A location, a date, and a rough idea of the shots you want — the rest gets handled."
  },
  {
    id: "how-fast",
    question: "How fast can we start?",
    answer: "Most shoots can be booked within a week, depending on the season."
  },
  {
    id: "travel",
    question: "Do you travel for shoots?",
    answer: "Yes — based in Johannesburg, available worldwide for the right project."
  }
];
