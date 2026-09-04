export type HistoryItem = {
  title: string;
  date: string;
  score: number;
  words: number;
  duration: string;
  tag: string;
};

export const HISTORY: HistoryItem[] = [
  {
    title: "Final Year Project Defence",
    date: "Aug 28, 2026",
    score: 88,
    words: 612,
    duration: "4m 05s",
    tag: "Academic",
  },
  {
    title: "Student Council Campaign Speech",
    date: "Aug 14, 2026",
    score: 82,
    words: 385,
    duration: "2m 34s",
    tag: "Persuasive",
  },
  {
    title: "Internship Elevator Pitch",
    date: "Jul 30, 2026",
    score: 76,
    words: 198,
    duration: "1m 19s",
    tag: "Pitch",
  },
  {
    title: "Debate Club — Opening Statement",
    date: "Jul 09, 2026",
    score: 71,
    words: 430,
    duration: "2m 52s",
    tag: "Debate",
  },
  {
    title: "Class Seminar: Climate Data",
    date: "Jun 21, 2026",
    score: 65,
    words: 540,
    duration: "3m 36s",
    tag: "Academic",
  },
];
