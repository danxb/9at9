"use client";

import { useEffect, useState } from "react";

export default function HeaderTagline() {
  const taglines = [
    "News Without the Noise.",
    "Text-only news. Read it anywhere.",
    "No ads. No popups. No pictures.",
    "Text-only. Safe for work.",
    "Nine stories. Nine o'clock.",
    "The day in one scroll.",
    "Your daily news snapshot at 9am.",
    "News that doesn't use all your data."
  ];

  const [tagline, setTagline] = useState<string | null>(null);

  useEffect(() => {
    const random =
      taglines[Math.floor(Math.random() * taglines.length)];
    setTagline(random);
  }, []);

  if (!tagline) return null; // or placeholder

  return <p className="text-sm text-gray-500 italic">{tagline}</p>;
}
