export default function HeaderTagline() {
  const taglines = [
    "News Without the Noise.",
    "Text-only news. Read it anywhere.",
    "No ads. No popups. No pictures. Just news.",
    "The least suspicious way to read the news at work.",
    "Clean. Quiet. News.",
    "Nine stories. Nine o'clock.",
    "The day in one scroll.",
    "Your daily news snapshot at 9am"
  ];

  const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];

  return <p className="text-sm text-gray-500 italic">{randomTagline}</p>;
}