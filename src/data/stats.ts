export interface Stat {
  id: string;
  value: string;
  label: string;
  description: string;
  countTo?: number;
  suffix?: string;
}

export const aboutStats: Stat[] = [
  {
    id: "top-content",
    value: "2M+",
    label: "Top-Performing Content",
    description: "One of my top-performing pieces of content I've created for the brand has gathered over 2 million views."
  },
  {
    id: "brands-shot",
    value: "PlayStation · ABSA",
    label: "Brands I've Shot For",
    description: "From global gaming brands to major banks and independent labels."
  },
  {
    id: "highlight-reels",
    value: "5",
    label: "Highlight Reels Live",
    description: "PlayStation, Les Créatifs, ABSA, Corporate & Publications — all documented."
  },
  {
    id: "based-in",
    value: "Johannesburg, SA",
    label: "Based, Shooting Worldwide",
    description: "Available to travel for the right project."
  }
];

export const impactStats: Stat[] = [
  {
    id: "projects-delivered",
    value: "0",
    label: "Projects Delivered",
    description: "Delivering thoughtful, high-quality work across a wide range of industries and clients.",
    countTo: 85,
    suffix: "+"
  },
  {
    id: "years-fine-dining",
    value: "0",
    label: "Years In Fine Dining & Luxury",
    description:
      "Creating visuals for the fine-dining and luxury space — print, social, and full art direction for documentary and advertising work in the restaurant industry.",
    countTo: 7,
    suffix: "+"
  },
  {
    id: "client-satisfaction",
    value: "0",
    label: "Client Satisfaction",
    description: "Long-term partnerships built on trust, clarity, and results.",
    countTo: 98,
    suffix: "%"
  },
  {
    id: "years-experience",
    value: "0",
    label: "Years Of Experience",
    description: "A proven track record of crafting impactful visual work over time.",
    countTo: 10,
    suffix: "+"
  }
];
