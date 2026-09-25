import type { LangCode, Status } from "./katha-data";

/**
 * Demo data for the batch-classroom features (lectures, weekly assessments,
 * progress, remedial). Shapes mirror the intended backend tables:
 * classes, students, lectures, lecture_languages, audio_tracks, caption_tracks,
 * assessments, assessment_questions, student_assessment_results,
 * student_progress, remedial_sessions.
 */

export const ALL_LANGS: LangCode[] = ["en", "hi", "sat", "mun", "ho"];

export const CLASS_INFO = {
  id: "c3a",
  name: "Class 3 — Section A",
  school: "GPS Bariatu, Ranchi",
  students: 68,
  todayLesson: "Plants Around Us",
};

export type TopicId = "parts" | "roots" | "uses" | "photo";
export const TOPICS: Record<TopicId, string> = {
  parts: "Parts of a Plant",
  roots: "Functions of Roots",
  uses: "Uses of Plants",
  photo: "Photosynthesis",
};

// ---------- Students ----------
export interface SchoolStudent {
  roll: number;
  name: string;
  mother: LangCode;
  score: number; // latest %
  weak: TopicId[];
  history: { lecture: string; score: number }[];
}

const FIRST = [
  "Sunita Murmu", "Ravi Kumar", "Birsa Purty", "Anjali Soy", "Mangal Hansda", "Pooja Devi",
  "Somra Topno", "Rekha Kisku", "Ajay Bodra", "Sita Mahto", "Kartik Munda", "Lakhi Baskey",
];
const GIVEN = ["Salomi", "Budhan", "Jitu", "Phulmani", "Ramesh", "Suman", "Dasmati", "Karan", "Basanti", "Sukra", "Meena", "Rohit", "Champa", "Etwa", "Priya", "Lalu", "Sonamani", "Deepak"];
const SUR: [string, LangCode][] = [["Murmu", "sat"], ["Hembrom", "sat"], ["Tudu", "sat"], ["Soren", "sat"], ["Purty", "ho"], ["Bodra", "ho"], ["Sinku", "ho"], ["Munda", "mun"], ["Topno", "mun"], ["Kumari", "hi"], ["Mahto", "hi"], ["Oraon", "hi"]];
const FIRST_LANG: LangCode[] = ["sat", "hi", "ho", "mun", "sat", "hi", "mun", "sat", "ho", "hi", "mun", "sat"];

// Seed scores: 56 understood, 8 practice, 4 attention  (≈82 / 12 / 6 %)
const PRACTICE = new Set([3, 5, 9, 17, 26, 38, 49, 61]);
const ATTENTION = new Set([1, 7, 22, 44]);

function seedScore(roll: number) {
  if (roll === 1) return 42;
  if (roll === 2) return 92;
  if (roll === 3) return 64;
  if (roll === 4) return 88;
  const r = (roll * 37) % 17;
  if (ATTENTION.has(roll)) return 30 + r;
  if (PRACTICE.has(roll)) return 55 + r;
  return 76 + (r % 20);
}

export const SEED_STUDENTS: SchoolStudent[] = Array.from({ length: 68 }, (_, i) => {
  const roll = i + 1;
  let name: string;
  let mother: LangCode;
  if (i < FIRST.length) {
    name = FIRST[i]!;
    mother = FIRST_LANG[i]!;
  } else {
    const [s, l] = SUR[(i * 5) % SUR.length]!;
    name = `${GIVEN[i % GIVEN.length]} ${s}`;
    mother = l;
  }
  const score = seedScore(roll);
  const weak: TopicId[] =
    roll === 1 ? ["roots", "photo"] : roll === 3 ? ["photo"] : score < 50 ? ["roots"] : score < 75 ? [roll % 2 ? "photo" : "roots"] : [];
  return {
    roll,
    name,
    mother,
    score,
    weak,
    history: [
      { lecture: "Plants Around Us", score },
      { lecture: "Animals Around Us", score: roll === 1 ? 61 : Math.min(98, score + ((roll * 7) % 15) - 5) },
      { lecture: "Water Around Us", score: roll === 1 ? 88 : Math.min(99, score + ((roll * 3) % 12)) },
    ],
  };
});

export const statusOf = (score: number): Status =>
  score >= 75 ? "understood" : score >= 50 ? "practice" : "attention";

// ---------- Lectures ----------
export type Caption = { t: number; visual: string; text: Record<LangCode, string> };

export interface AudioTrack {
  lang: LangCode;
  /** Real dubbed audio URL when the AI pipeline is connected; null → sample voice (browser TTS). */
  url: string | null;
  status: "ready" | "processing";
}

export interface Lecture {
  id: string;
  title: string;
  subject: string;
  cls: string;
  topic: string;
  original: LangCode;
  status: "ready" | "processing";
  duration: number; // seconds
  videoUrl: string | null; // uploaded video (object URL in prototype)
  audio: AudioTrack[];
  captions: Caption[];
}

const tracks = (status: "ready" | "processing" = "ready"): AudioTrack[] =>
  ALL_LANGS.map((lang) => ({ lang, url: null, status }));

export const PLANT_CAPTIONS: Caption[] = [
  { t: 0, visual: "🌱", text: { en: "Plants are living things.", hi: "पौधे सजीव होते हैं।", sat: "Daru-ko jiwet jinis kana.", ho: "Daru-ko jiwid kaji tana.", mun: "Daru-ko jiwid jinis kana." } },
  { t: 5, visual: "💧☀️", text: { en: "They need water and sunlight.", hi: "उन्हें पानी और धूप चाहिए।", sat: "Unkin dak' ar sińmãrsal lagatin.", ho: "Enko da' ondo singi mãrsal lagatina.", mun: "Ako da' ad singi marsal lagao-a." } },
  { t: 10, visual: "🌿⬇️", text: { en: "Roots absorb water from the soil.", hi: "जड़ें मिट्टी से पानी सोखती हैं।", sat: "Rehet' hasa khon dak' ńu-ea.", ho: "Rehed hasa ete da' nuea.", mun: "Rehed hasa-ete da' nu-ea." } },
  { t: 15, visual: "🪵⬆️", text: { en: "The stem carries water up to the leaves.", hi: "तना पानी को पत्तियों तक ले जाता है।", sat: "Daru-mońj dak' sakam tak' idi-ea.", ho: "Daru-mom da' sakam taa idiea.", mun: "Daru-mom da' sakam tak idi-ea." } },
  { t: 20, visual: "🍃☀️", text: { en: "Leaves make food using sunlight.", hi: "पत्तियाँ धूप से भोजन बनाती हैं।", sat: "Sakam sińmãrsal te jom-jinis benaw-ea.", ho: "Sakam singi mãrsal te jomea benaoea.", mun: "Sakam singi marsal-te jom-jinis benao-ea." } },
  { t: 25, visual: "🍎🌳", text: { en: "Plants give us food, air and shade.", hi: "पौधे हमें भोजन, हवा और छाया देते हैं।", sat: "Daru-ko ale jom, hoe ar umul ale emaleya.", ho: "Daru-ko ale jomea, hoyo ondo umbul emaleya.", mun: "Daru-ko ale jom, hoyo ad umbul emale-a." } },
];

const WATER_CAPTIONS: Caption[] = [
  { t: 0, visual: "💧", text: { en: "We need water every day.", hi: "हमें हर दिन पानी चाहिए।", sat: "Ale dak' hilok hilok lagatin.", ho: "Ale da' mid mid singi lagatina.", mun: "Ale da' sanamang singi lagao-a." } },
  { t: 6, visual: "🏞️", text: { en: "Water comes from rivers, wells and rain.", hi: "पानी नदी, कुएँ और बारिश से आता है।", sat: "Dak' gada, kuã ar dak' gama khon hijuk'a.", ho: "Da' gada, kuã ondo gama ete hijua.", mun: "Da' gada, kuã ad gama-ete hiju-a." } },
  { t: 12, visual: "🫗", text: { en: "Always drink clean water.", hi: "हमेशा साफ पानी पिएँ।", sat: "Sanam jokhen sapha dak' nu pe.", ho: "Sanam ghari sapha da' nupe.", mun: "Sanam jokhen sapha da' nupe." } },
  { t: 18, visual: "🚰", text: { en: "Do not waste water.", hi: "पानी बर्बाद न करें।", sat: "Dak' alope nosto-a.", ho: "Da' alope nosto-a.", mun: "Da' alope nosto-a." } },
];

export const SEED_LECTURES: Lecture[] = [
  { id: "plants", title: "Plants Around Us", subject: "Environmental Studies", cls: "Class 3", topic: "Parts and functions of a plant", original: "hi", status: "ready", duration: 30, videoUrl: null, audio: tracks(), captions: PLANT_CAPTIONS },
  { id: "water", title: "Water Around Us", subject: "Environmental Studies", cls: "Class 3", topic: "Sources and uses of water", original: "hi", status: "ready", duration: 24, videoUrl: null, audio: tracks(), captions: WATER_CAPTIONS },
  { id: "animals", title: "Animals Around Us", subject: "Environmental Studies", cls: "Class 3", topic: "Domestic and wild animals", original: "en", status: "processing", duration: 0, videoUrl: null, audio: tracks("processing"), captions: [] },
];

// ---------- Weekly assessment ----------
export interface AQuestion {
  id: string;
  topic: TopicId;
  q: Record<LangCode, string>;
  options: string[];
  answer: number;
}

export const WEEKLY_QUESTIONS: AQuestion[] = [
  { id: "q1", topic: "roots", answer: 2, options: ["Leaf", "Stem", "Root", "Flower"], q: { en: "Which part of a plant absorbs water from the soil?", hi: "पौधे का कौन-सा भाग मिट्टी से पानी सोखता है?", sat: "Daru reak' okoe hatin hasa khon dak' ńu-ea?", ho: "Daru-rea okon hatin hasa ete da' nuea?", mun: "Daru-rea okon hating hasa-ete da' nu-ea?" } },
  { id: "q2", topic: "parts", answer: 1, options: ["Root", "Stem", "Seed", "Fruit"], q: { en: "Which part holds the plant upright?", hi: "कौन-सा भाग पौधे को सीधा खड़ा रखता है?", sat: "Okoe hatin daru tengo-ea?", ho: "Okon hatin daru-e tinguea?", mun: "Okon hating daru-e tingu-ea?" } },
  { id: "q3", topic: "photo", answer: 0, options: ["Leaves", "Roots", "Flowers", "Bark"], q: { en: "Which part makes food for the plant using sunlight?", hi: "कौन-सा भाग धूप से पौधे का भोजन बनाता है?", sat: "Okoe hatin sińmãrsal te jom benaw-ea?", ho: "Okon hatin singi mãrsal te jomea benaoea?", mun: "Okon hating singi marsal-te jom benao-ea?" } },
  { id: "q4", topic: "uses", answer: 3, options: ["Plastic", "Iron", "Glass", "Wood"], q: { en: "Which of these do we get from plants?", hi: "इनमें से कौन-सी चीज़ हमें पौधों से मिलती है?", sat: "Nia te okoe jinis daru khon ale ńam-a?", ho: "Nea te okon jinis daru ete ale nama?", mun: "Nea-te okon jinis daru-ete ale nam-a?" } },
  { id: "q5", topic: "roots", answer: 1, options: ["They make seeds", "They hold the plant in the soil", "They make flowers", "They give colour"], q: { en: "What else do roots do?", hi: "जड़ें और क्या काम करती हैं?", sat: "Rehet' ar cet' kami-ya?", ho: "Rehed ondo cikan kami-ya?", mun: "Rehed ad cikan kami-a?" } },
];

export interface RemedialSession {
  id: string;
  topic: string;
  students: number;
  lang: LangCode;
  when: string;
  minutes: number;
}

export const SEED_REMEDIAL: RemedialSession[] = [
  { id: "r1", topic: "Functions of Roots", students: 18, lang: "sat", when: "Tomorrow — 10:30 AM", minutes: 20 },
];

export const fmtTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
