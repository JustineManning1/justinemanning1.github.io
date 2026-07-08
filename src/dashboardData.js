// Trailing 12 months of illustrative sample data — modeled to reflect realistic,
// noisy operational metrics rather than idealized smooth trends.
export const months = [
  "Aug '25",
  "Sep '25",
  "Oct '25",
  "Nov '25",
  "Dec '25",
  "Jan '26",
  "Feb '26",
  "Mar '26",
  "Apr '26",
  "May '26",
  "Jun '26",
  "Jul '26",
];

export const series = {
  // Calls handled per agent per day
  callsPerAgent: [40, 43, 41, 46, 44, 48, 47, 51, 50, 54, 53, 57],
  // Cost-to-serve index, indexed to a fixed baseline (lower is better)
  costIndex: [102, 99, 101, 97, 96, 94, 92, 90, 89, 87, 86, 84],
  // Customer satisfaction score (0-100)
  csat: [88, 89, 87, 90, 91, 90, 92, 91, 93, 92, 94, 94],
  // Average ticket resolution time in hours (lower is better)
  resolutionTime: [5.4, 5.2, 5.3, 5.0, 4.9, 4.7, 4.6, 4.4, 4.3, 4.1, 4.0, 3.9],
};

export const target = { costIndex: 85 };

export const kpiBars = {
  6: [
    { label: "CSAT", value: 93, color: "var(--chart-1)" },
    { label: "Retention", value: 88, color: "var(--chart-2)" },
    { label: "Cost Efficiency", value: 79, color: "var(--chart-3)" },
    { label: "Resolution Time", value: 85, color: "var(--chart-4)" },
  ],
  12: [
    { label: "CSAT", value: 91, color: "var(--chart-1)" },
    { label: "Retention", value: 87, color: "var(--chart-2)" },
    { label: "Cost Efficiency", value: 74, color: "var(--chart-3)" },
    { label: "Resolution Time", value: 81, color: "var(--chart-4)" },
  ],
};
