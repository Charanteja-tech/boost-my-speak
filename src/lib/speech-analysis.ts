export type Analysis = {
  score: number;
  scores: { confidence: number; clarity: number; structure: number; engagement: number };
  strengths: string[];
  improvements: string[];
  metrics: {
    wordCount: number;
    speakingTime: string;
    avgSentenceLength: number;
    fillerWords: number;
  };
  recommendations: { title: string; detail: string }[];
};

const FILLERS = [
  "um",
  "uh",
  "like",
  "basically",
  "actually",
  "literally",
  "kind of",
  "sort of",
  "you know",
  "i mean",
  "just",
  "really",
  "very",
  "so",
  "maybe",
];

const HEDGES = ["maybe", "perhaps", "i think", "i guess", "hopefully", "probably", "might"];
const POWER = [
  "we will",
  "imagine",
  "today",
  "because",
  "result",
  "proof",
  "must",
  "let's",
  "you can",
  "finally",
];

const clamp = (n: number, min = 38, max = 98) => Math.max(min, Math.min(max, Math.round(n)));

export function analyzeSpeech(raw: string): Analysis {
  const text = raw.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 1);
  const sentenceCount = Math.max(1, sentences.length);
  const avgSentenceLength = Math.round(wordCount / sentenceCount);

  let fillerWords = 0;
  for (const f of FILLERS) {
    const m = lower.match(new RegExp(`(^|[^a-z])${f}([^a-z]|$)`, "g"));
    fillerWords += m ? m.length : 0;
  }
  const hedges = HEDGES.reduce((a, h) => a + (lower.split(h).length - 1), 0);
  const power = POWER.reduce((a, p) => a + (lower.split(p).length - 1), 0);
  const questions = (text.match(/\?/g) || []).length;
  const numbers = (text.match(/\b\d[\d,.%]*\b/g) || []).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  // repetition
  const freq = new Map<string, number>();
  for (const w of words) {
    const k = w.toLowerCase().replace(/[^a-z']/g, "");
    if (k.length > 4) freq.set(k, (freq.get(k) || 0) + 1);
  }
  const repeated = [...freq.entries()].filter(([, c]) => c >= 4).sort((a, b) => b[1] - a[1]);
  const repetitionRate = wordCount ? repeated.reduce((a, [, c]) => a + c, 0) / wordCount : 0;

  const fillerRate = wordCount ? fillerWords / wordCount : 0;
  const lengthFit = wordCount === 0 ? 0 : Math.min(1, wordCount / 320);

  const confidence = clamp(
    92 - fillerRate * 420 - (hedges / Math.max(1, sentenceCount)) * 90 + power * 1.4,
  );
  const clarity = clamp(
    96 - Math.abs(avgSentenceLength - 15) * 2.4 - fillerRate * 260 - repetitionRate * 180,
  );
  const structure = clamp(
    52 + paragraphs * 7 + Math.min(20, sentenceCount * 1.2) + lengthFit * 16 - (avgSentenceLength > 26 ? 12 : 0),
  );
  const engagement = clamp(
    58 + questions * 6 + numbers * 2.6 + power * 2.2 + lengthFit * 14 - repetitionRate * 120,
  );

  const score = clamp(
    confidence * 0.25 + clarity * 0.3 + structure * 0.22 + engagement * 0.23,
    35,
    99,
  );

  const seconds = Math.round((wordCount / 150) * 60);
  const speakingTime = `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;

  const strengths: string[] = [];
  if (clarity >= 78) strengths.push("Clear explanation — your sentences are easy to follow aloud");
  if (structure >= 75) strengths.push("Strong structure with a recognisable arc from open to close");
  if (numbers >= 2) strengths.push("Good use of concrete examples and specific numbers");
  if (questions >= 1) strengths.push("Rhetorical questions pull the audience in");
  if (confidence >= 80) strengths.push("Confident, assertive phrasing with few hedges");
  if (wordCount > 250) strengths.push("Enough substance to fill your slot without rushing");
  if (strengths.length < 3)
    strengths.push("Conversational tone that will feel natural on stage", "A clear point of view");

  const improvements: string[] = [];
  if (sentences[0] && sentences[0].split(/\s+/).length > 25)
    improvements.push("Introduction is slightly long — trim the opening to one sharp line");
  if (repeated.length)
    improvements.push(
      `Some phrasing is repetitive — "${repeated[0]![0]}" appears ${repeated[0]![1]} times`,
    );
  if (fillerWords > 3) improvements.push(`Cut filler words — we counted ${fillerWords}`);
  if (paragraphs < 3)
    improvements.push("Add a stronger transition between sections so the shift is audible");
  if (avgSentenceLength > 20)
    improvements.push("Sentences average long — break them for easier breathing");
  if (avgSentenceLength < 9 && wordCount > 60)
    improvements.push("Very short sentences throughout — vary rhythm to avoid a choppy delivery");
  if (hedges > 2) improvements.push("Reduce hedging language like \u201cmaybe\u201d and \u201cI think\u201d");
  if (improvements.length < 3)
    improvements.push(
      "End on a single memorable line rather than a summary",
      "Signpost your sections so listeners know where they are",
    );

  const recommendations = [
    fillerWords > 3
      ? {
          title: "Replace fillers with a two-beat pause",
          detail: `You used ${fillerWords} filler words. Rehearse once out loud and silently count "one-two" wherever an "um" appears — pauses read as authority.`,
        }
      : {
          title: "Use pauses as punctuation",
          detail:
            "Your text is clean of filler. Now mark three deliberate pauses — after your hook, before your key claim, and before the last line.",
        },
    avgSentenceLength > 18
      ? {
          title: `Cut sentence length from ${avgSentenceLength} to ~14 words`,
          detail:
            "Split every sentence that contains an \u201cand\u201d or a comma-chain. Shorter sentences let you land the emphasis instead of chasing breath.",
        }
      : {
          title: "Vary your sentence rhythm",
          detail:
            "Follow two or three short sentences with one longer one. That contrast keeps a listening audience from tuning out.",
        },
    structure < 78
      ? {
          title: "Give the talk three visible pillars",
          detail:
            "Announce them up front (\u201cthree things\u201d), then verbally number them. Structure heard is structure remembered.",
        }
      : {
          title: "Strengthen the callback close",
          detail:
            "Return to the image or number from your opening in the final sentence. A callback makes the whole talk feel designed.",
        },
  ];

  return {
    score,
    scores: { confidence, clarity, structure, engagement },
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    metrics: { wordCount, speakingTime, avgSentenceLength, fillerWords },
    recommendations,
  };
}

export function improveSpeech(raw: string): string {
  const text = raw.trim();
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const tidy = (s: string) => {
    let out = s;
    for (const f of ["basically ", "actually ", "literally ", "you know, ", "I mean, ", "um, ", "uh, ", "sort of ", "kind of "]) {
      out = out.replace(new RegExp(f, "gi"), "");
    }
    out = out.replace(/\bI think that\b/gi, "").replace(/\bmaybe\b/gi, "").replace(/\s{2,}/g, " ");
    // split overly long sentences at the first ", and"
    out = out.replace(/,\s+and\s+/, ". ").trim();
    out = out.replace(/([.!?]\s+)([a-z])/g, (_m, a: string, b: string) => a + b.toUpperCase());
    return out.charAt(0).toUpperCase() + out.slice(1);
  };

  const body = sentences.slice(1, Math.max(1, sentences.length - 1)).map(tidy);
  const third = Math.ceil(body.length / 3) || 1;
  const blocks = [body.slice(0, third), body.slice(third, third * 2), body.slice(third * 2)].filter(
    (b) => b.length,
  );

  const opener =
    "Here's the one thing I want you to leave with today. " +
    (sentences[0] ? tidy(sentences[0]!) : "");

  const closer =
    (sentences.length > 1 ? tidy(sentences[sentences.length - 1]!) + " " : "") +
    "So if you remember nothing else, remember this: the idea only matters once someone acts on it \u2014 and that someone is in this room.";

  const labels = ["First,", "Second,", "Finally,"];
  const structured = blocks
    .map((b, i) => `${labels[i] ?? "Next,"} ${b.join(" ")}`)
    .join("\n\n");

  return [opener, structured, closer].filter(Boolean).join("\n\n");
}

export const SAMPLE_SPEECH = `Good morning everyone, and thank you so much for being here today, I really appreciate it, and I basically want to talk about something that I think is actually really important for all of us as students.

Last semester I failed my first real presentation. I had thirty slides, four minutes, and no idea what my point was. I read every word off the screen. Afterwards my professor asked me one question: what did you want us to do? I had no answer.

That question changed how I prepare. Now I start every talk by writing one sentence, the sentence I want people to repeat later. Everything that does not support that sentence gets cut, and that usually removes about half of my material.

The second thing I changed was rehearsal. I used to read my notes silently in my room. Now I say it out loud three times, standing up, with a timer. The first run is always messy, the second one finds the rhythm, and the third one is the one I actually give.

The third thing is nerves. I used to think confident speakers do not feel nervous. Data from our communication lab shows 87% of experienced speakers still feel it, they just have somewhere to put it. I put mine into the first ten seconds, I walk to the centre, I stop, and I look at one person before I start.

So maybe if you are dreading a presentation this week, do not memorise more, just find your one sentence, say it out loud three times, and give your nerves a job. Thank you.`;
