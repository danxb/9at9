const earlyPhrases = [
  "I'm early… who even am I?",
  "Ahead of schedule!",
  "I got here before I was supposed to.",
  "Look at me being early.",
  "I arrived before the future happened.",
  "Too early? Probably.",
  "I beat the clock.",
  "Timekeeping: overachiever mode.",
  "I'm early… please applaud.",
  "Suspiciously punctual… early, even.",
  "I showed up before the universe expected me.",
  "I surprised myself by being early."
];

const onTimePhrases = [
  "Right on time today!",
  "Bang on time.",
  "Nailed the timing.",
  "Arrived with precision.",
  "Perfectly punctual.",
  "Look at me being on time.",
  "On the dot.",
  "I actually made it on time.",
  "Hit the exact minute.",
  "Zero minutes late for once.",
  "Feels weird being punctual.",
  "The stars aligned for my timing.",
  "Chronological excellence achieved.",
  "Behold, punctuality!",
  "I swear I didn't rush… much."
];

const lateExcuses = [
  "Close enough",
  "Sorry I'm late",
  "Just about on time… ish.",
  "A fashionable few minutes late.",
  "Margin-of-error arrival.",
  "Thanks for waiting!",
  "Appreciate your patience.",
  "I'm not late, everyone else is early.",
  "Got stuck in a loading screen."
];

export const getTagline = (loading: boolean, lastUpdated: string, prevTagline: string): string => {
  const now = new Date();

  const lastUpdatedDate = new Date(lastUpdated);

  if (isYesterday(lastUpdatedDate)) {
    if (loading) {
        return "Getting today's stories as we speak";
    }
    return "Check back at 9am for today's news";
  }

  if (isToday(lastUpdatedDate)) {
    if (!loading && prevTagline === "Getting today's stories as we speak") {
        return "Ready! Refresh for today's stories";
    }

    switch (compareToNineAM(lastUpdatedDate)) {
        case "before":
            return earlyPhrases[Math.floor(Math.random() * earlyPhrases.length)];

        case "exact":
            return onTimePhrases[Math.floor(Math.random() * onTimePhrases.length)];

        case "after":
            return lateExcuses[Math.floor(Math.random() * lateExcuses.length)];
    }
  }

  return "Time is a social construct.";
};

const compareToNineAM = (lastUpdatedDate: Date): "before" | "exact" | "after" => {
  const nineAM = new Date(lastUpdatedDate); // start with same day
  nineAM.setHours(9, 0, 0, 0); // 09:00:00.000

  if (lastUpdatedDate.getTime() < nineAM.getTime()) return "before";
  if (lastUpdatedDate.getTime() === nineAM.getTime()) return "exact";
  return "after";
};

export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function formatLastUpdated(date: Date): string {
  const now = new Date();
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

  if (date.toDateString() === now.toDateString()) return `Updated: ${time}`;
  if (isYesterday(date)) return `Updated: Yesterday ${time}`;
  return `Updated: ${date.toLocaleDateString()} ${time}`;
}