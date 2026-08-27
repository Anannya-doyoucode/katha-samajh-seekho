export type LangCode = "en" | "hi" | "sat" | "ho" | "mun";

export const LANGUAGES: { code: LangCode; name: string; native: string; offline: boolean }[] = [
  { code: "en", name: "English", native: "English", offline: true },
  { code: "hi", name: "Hindi", native: "हिन्दी", offline: true },
  { code: "sat", name: "Santhali", native: "ᱥᱟᱱᱛᱟᱲᱤ", offline: true },
  { code: "ho", name: "Ho", native: "Ho / 𑢹𑣉𑣉", offline: false },
  { code: "mun", name: "Mundari", native: "Muṇḍari", offline: true },
];

export const langName = (code: LangCode) =>
  LANGUAGES.find((l) => l.code === code)?.name ?? code;
export const langNative = (code: LangCode) =>
  LANGUAGES.find((l) => l.code === code)?.native ?? code;

type L = Record<LangCode, string>;

export type ConceptId = "roots" | "stem" | "leaves";

export interface ConceptContent {
  id: ConceptId;
  label: L;
  /** Literal translation of what the teacher said */
  teacher: L;
  translation: L;
  /** KATHA's pedagogical, context-aware explanation */
  katha: L;
  /** A completely different explanation used for adaptive re-teaching */
  kathaAlt: L;
  visual: string;
  questions: [QuizQuestion, QuizQuestion];
}

export interface QuizQuestion {
  id: string;
  kind: "mcq" | "image" | "voice";
  prompt: L;
  options: { id: string; label: L; emoji?: string; correct?: boolean }[];
  hint: L;
}

export const CONCEPTS: ConceptContent[] = [
  {
    id: "roots",
    label: {
      en: "Roots",
      hi: "जड़",
      sat: "ᱨᱮᱦᱮᱫ (Rehed)",
      ho: "Rehed",
      mun: "Rehed",
    },
    visual: "🌱",
    teacher: {
      en: "The roots of a plant absorb water and minerals from the soil and anchor the plant firmly.",
      hi: "पौधे की जड़ें मिट्टी से पानी और खनिज सोखती हैं और पौधे को मज़बूती से पकड़ती हैं।",
      sat: "ᱫᱟᱨᱮ ᱨᱮᱦᱮᱫ ᱦᱟᱥᱟ ᱠᱷᱚᱱ ᱫᱟᱜ ᱟᱨ ᱡᱟᱱᱟᱣ ᱮᱢ ᱠᱟᱛᱮ ᱫᱟᱨᱮ ᱠᱮ ᱛᱮᱛᱟᱝ ᱫᱚᱦᱚᱭᱟ᱾",
      ho: "Dare rehed hasa te da' aa jinis idi tana ar dare ke keteji dohoya.",
      mun: "Dare rehed hasa ete da' aur khanij susun tana, ar dare ke jom dohotana.",
    },
    translation: {
      en: "Roots take water and minerals from the soil and hold the plant tightly.",
      hi: "जड़ें मिट्टी से पानी और खनिज लेती हैं और पौधे को कसकर पकड़े रखती हैं।",
      sat: "ᱨᱮᱦᱮᱫ ᱫᱚ ᱦᱟᱥᱟ ᱠᱷᱚᱱ ᱫᱟᱜ ᱟᱜᱩᱭᱟ ᱟᱨ ᱫᱟᱨᱮ ᱠᱮ ᱛᱮᱛᱟᱝ ᱥᱟᱵ ᱫᱚᱦᱚᱭᱟ᱾",
      ho: "Rehed do hasa ete da' aguya ar dare ke keteji sab dohoya.",
      mun: "Rehed do hasa ete da' aguatana ar dare ke keteji sab dohotana.",
    },
    katha: {
      en: "Think of the mahua tree behind your school. Even in a storm it does not fall — because its roots hold the earth like an anchor. Roots also drink water, the way you sip water from a lota after playing.",
      hi: "अपने स्कूल के पीछे वाले महुआ के पेड़ को सोचो। आँधी में भी वह गिरता नहीं — क्योंकि उसकी जड़ें मिट्टी को लंगर की तरह पकड़े रहती हैं। जड़ें पानी भी पीती हैं, जैसे खेलने के बाद तुम लोटे से पानी पीते हो।",
      sat: "ᱟᱢᱟᱜ ᱥᱠᱩᱞ ᱛᱟᱭᱚᱢ ᱨᱮᱱ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱠᱚ ᱩᱲᱟᱹᱣ ᱢᱮ᱾ ᱦᱚᱭ ᱦᱚᱸ ᱵᱟᱝ ᱜᱩᱨᱩᱡᱩᱜ-ᱟ — ᱪᱮᱫᱟᱜ ᱥᱮ ᱩᱱᱤᱭᱟᱜ ᱨᱮᱦᱮᱫ ᱦᱟᱥᱟ ᱠᱮ ᱛᱮᱛᱟᱝ ᱥᱟᱵ ᱫᱚᱦᱚᱭᱟ᱾ ᱨᱮᱦᱮᱫ ᱫᱟᱜ ᱦᱚᱸ ᱧᱩᱭᱟ᱾",
      ho: "Ampe scoolre taiom mahua dare ke uduba. Hoyo re ho ka gujuwa — chiyaga uni rehed hasa ke keteji sab doho tana. Rehed da' ho nu tana, jelka ape enel taiom lota ete da' nu tanape.",
      mun: "Ampeya scool tayom mahua dare nel me. Hoyo hilare ho ka uyugoa — chiyanko uni rehed hasa keteji sabtana. Rehed da' ho nutana, jelka ape lota ete da' nu tanape.",
    },
    kathaAlt: {
      en: "Try this instead: roots are like your feet. When you stand in the school ground and your friend pushes you, your feet keep you from falling. And just like your mouth drinks water, roots are the plant's mouth inside the soil.",
      hi: "अब ऐसे सोचो: जड़ें तुम्हारे पैरों जैसी हैं। मैदान में खड़े हो और दोस्त धक्का दे, तो पैर तुम्हें गिरने नहीं देते। और जैसे मुँह से तुम पानी पीते हो, वैसे ही जड़ मिट्टी के अंदर पौधे का मुँह है।",
      sat: "ᱱᱤᱛᱚᱜ ᱱᱚᱶᱟ ᱞᱮᱠᱟ ᱩᱲᱟᱹᱣ ᱢᱮ — ᱨᱮᱦᱮᱫ ᱫᱚ ᱟᱢᱟᱜ ᱡᱟᱸᱜᱟ ᱞᱮᱠᱟ ᱠᱟᱱᱟ᱾ ᱜᱟᱨᱟᱭᱮᱫ ᱨᱮ ᱛᱤᱸᱜᱩ ᱠᱟᱛᱮ ᱜᱟᱛᱮ ᱛᱩᱞᱩᱡ ᱢᱮ ᱠᱷᱟᱱ ᱡᱟᱸᱜᱟ ᱫᱚ ᱵᱟᱝ ᱜᱩᱡᱩᱜ ᱮᱢᱟᱢ-ᱟ᱾",
      ho: "Nite nea leka uduba — rehed do ampeya kata leka tana. Akharare tingu kate gate tulu tana redo kata ape ke ka gujuw emape. Ar jelka moche te da' nutanape, rehed do hasa bhitri re dare aa moche tana.",
      mun: "Nete nea leka nel me — rehed do apeya kata leka. Akhrare tingu tanare gate dhakka emare, kata ape ke ka uyug emape. Ar jelka mocha te da' nutanape, rehed do dare aa mocha hasa bhitare.",
    },
    questions: [
      {
        id: "roots-q1",
        kind: "mcq",
        prompt: {
          en: "A strong wind blows all night. Why does the mango tree still stand in the morning?",
          hi: "रातभर तेज़ हवा चली। सुबह आम का पेड़ फिर भी क्यों खड़ा है?",
          sat: "ᱧᱤᱫᱟᱹ ᱡᱟᱠᱟᱛ ᱡᱚᱨ ᱦᱚᱭ ᱦᱩᱭᱮᱱᱟ᱾ ᱥᱮᱛᱟᱜ ᱨᱮ ᱩᱞ ᱫᱟᱨᱮ ᱪᱮᱫᱟᱜ ᱛᱤᱸᱜᱩ ᱟᱠᱟᱱᱟ?",
          ho: "Nida jakat jor hoyo hoyena. Setag re uli dare chiyaga tingu akana?",
          mun: "Nida jakat jor hoyo hoyena. Setak re uli dare chiyanko tingu akana?",
        },
        options: [
          {
            id: "a",
            label: {
              en: "Its roots hold the soil tightly",
              hi: "इसकी जड़ें मिट्टी को कसकर पकड़ती हैं",
              sat: "ᱨᱮᱦᱮᱫ ᱦᱟᱥᱟ ᱠᱮ ᱛᱮᱛᱟᱝ ᱥᱟᱵ ᱫᱚᱦᱚᱭᱟ",
              ho: "Rehed hasa ke keteji sab dohoya",
              mun: "Rehed hasa keteji sabtana",
            },
            correct: true,
          },
          {
            id: "b",
            label: {
              en: "Its leaves are heavy",
              hi: "इसकी पत्तियाँ भारी हैं",
              sat: "ᱥᱟᱠᱟᱢ ᱫᱚ ᱦᱟᱢᱵᱟᱞ",
              ho: "Sakam do haambal",
              mun: "Sakam do haambal",
            },
          },
          {
            id: "c",
            label: {
              en: "Its flowers are colourful",
              hi: "इसके फूल रंगीन हैं",
              sat: "ᱵᱟᱦᱟ ᱫᱚ ᱨᱚᱸᱜᱤᱱ",
              ho: "Baa do rongin",
              mun: "Baha do rongin",
            },
          },
        ],
        hint: {
          en: "Think about what is under the ground.",
          hi: "सोचो ज़मीन के नीचे क्या है।",
          sat: "ᱦᱟᱥᱟ ᱞᱟᱛᱟᱨ ᱨᱮ ᱪᱮᱫ ᱢᱮᱱᱟᱜ ᱟ, ᱩᱲᱟᱹᱣ ᱢᱮ᱾",
          ho: "Hasa latar re chi mena, uduba.",
          mun: "Hasa latar re chi mena, uduba.",
        },
      },
      {
        id: "roots-q2",
        kind: "image",
        prompt: {
          en: "Ravi pulls a small plant out of the soil and keeps it on a stone. In two days it dries up. Which part is missing its work?",
          hi: "रवि एक छोटा पौधा मिट्टी से निकालकर पत्थर पर रख देता है। दो दिन में वह सूख जाता है। किस भाग का काम रुक गया?",
          sat: "ᱨᱟᱶᱤ ᱢᱤᱫ ᱦᱩᱰᱤᱧ ᱫᱟᱨᱮ ᱦᱟᱥᱟ ᱠᱷᱚᱱ ᱩᱨᱩᱜ ᱠᱟᱛᱮ ᱫᱷᱤᱨᱤ ᱨᱮ ᱫᱚᱦᱚ ᱠᱮᱫᱟ᱾ ᱵᱟᱨ ᱢᱟ�హᱟᱸ ᱨᱮ ᱨᱚᱦᱚᱲ ᱮᱱᱟ᱾ ᱚᱠᱟ ᱦᱟᱹᱴᱤᱧ ᱟᱜ ᱠᱟᱹᱢᱤ ᱛᱷᱤᱨ ᱮᱱᱟ?",
          ho: "Ravi mid huding dare hasa ete uru kate dhiri re doho keda. Baria mahan re rohor yena. Oko hatin aa kami tir yena?",
          mun: "Ravi mid huring dare hasa ete uru kate dhiri re doho keda. Baria mahan re rohor yena. Oko hating aa kami tir yena?",
        },
        options: [
          {
            id: "a",
            emoji: "🌿",
            label: {
              en: "Leaf",
              hi: "पत्ती",
              sat: "ᱥᱟᱠᱟᱢ",
              ho: "Sakam",
              mun: "Sakam",
            },
          },
          {
            id: "b",
            emoji: "🌱",
            label: {
              en: "Root",
              hi: "जड़",
              sat: "ᱨᱮᱦᱮᱫ",
              ho: "Rehed",
              mun: "Rehed",
            },
            correct: true,
          },
          {
            id: "c",
            emoji: "🌸",
            label: {
              en: "Flower",
              hi: "फूल",
              sat: "ᱵᱟᱦᱟ",
              ho: "Baa",
              mun: "Baha",
            },
          },
        ],
        hint: {
          en: "Which part was drinking water for the plant?",
          hi: "पौधे के लिए पानी कौन पी रहा था?",
          sat: "ᱫᱟᱨᱮ ᱞᱟᱹᱜᱤᱫ ᱚᱠᱟ ᱦᱟᱹᱴᱤᱧ ᱫᱟᱜ ᱧᱩ ᱮᱫ ᱛᱟᱦᱮᱸᱱᱟ?",
          ho: "Dare nagente oko hatin da' nu tan taikena?",
          mun: "Dare nagente oko hating da' nu tan taikena?",
        },
      },
    ],
  },
  {
    id: "stem",
    label: {
      en: "Stem",
      hi: "तना",
      sat: "ᱡᱟᱝ (Jang)",
      ho: "Jang",
      mun: "Jang",
    },
    visual: "🎋",
    teacher: {
      en: "The stem transports water from the roots to the leaves and holds the branches upright.",
      hi: "तना जड़ों से पानी पत्तियों तक पहुँचाता है और शाखाओं को सीधा खड़ा रखता है।",
      sat: "ᱡᱟᱝ ᱫᱚ ᱨᱮᱦᱮᱫ ᱠᱷᱚᱱ ᱥᱟᱠᱟᱢ ᱦᱟᱹᱵᱤᱡ ᱫᱟᱜ ᱥᱮᱴᱮᱨ ᱟ ᱟᱨ ᱠᱚᱴᱟᱢ ᱠᱚ ᱠᱮ ᱥᱚᱡᱚ ᱫᱚᱦᱚᱭᱟ᱾",
      ho: "Jang do rehed ete sakam hapa da' seter aa ar kotam ko ke sojo dohoya.",
      mun: "Jang do rehed ete sakam jaked da' setertana ar dali ko ke sojo dohotana.",
    },
    translation: {
      en: "The stem carries water from the roots up to the leaves and keeps the plant standing straight.",
      hi: "तना जड़ों से पानी ऊपर पत्तियों तक ले जाता है और पौधे को सीधा रखता है।",
      sat: "ᱡᱟᱝ ᱫᱚ ᱨᱮᱦᱮᱫ ᱠᱷᱚᱱ ᱫᱟᱜ ᱪᱮᱛᱟᱱ ᱥᱟᱠᱟᱢ ᱛᱮ ᱤᱫᱤᱭᱟ ᱟᱨ ᱫᱟᱨᱮ ᱠᱮ ᱥᱚᱡᱚ ᱫᱚᱦᱚᱭᱟ᱾",
      ho: "Jang do rehed ete da' chetan sakam te idiya ar dare ke sojo dohoya.",
      mun: "Jang do rehed ete da' chetan sakam te idiya ar dare ke sojo dohotana.",
    },
    katha: {
      en: "The stem is the plant's water pipe. Like the pipe from the village hand-pump carries water to every house, the stem carries water from the roots to every leaf — and it also stands straight so the leaves can meet the sun.",
      hi: "तना पौधे का पानी वाला पाइप है। जैसे गाँव के चापाकल का पाइप हर घर तक पानी ले जाता है, वैसे ही तना जड़ों का पानी हर पत्ती तक पहुँचाता है — और सीधा खड़ा रहकर पत्तियों को धूप दिलाता है।",
      sat: "ᱡᱟᱝ ᱫᱚ ᱫᱟᱨᱮ ᱟᱜ ᱫᱟᱜ ᱯᱟᱭᱤᱯ ᱠᱟᱱᱟ᱾ ᱟᱹᱛᱩ ᱨᱮᱱ ᱪᱟᱯᱟᱠᱚᱞ ᱟᱜ ᱯᱟᱭᱤᱯ ᱡᱚᱛᱚ ᱚᱲᱟᱜ ᱛᱮ ᱫᱟᱜ ᱤᱫᱤᱭᱟ, ᱚᱱᱠᱟᱜᱮ ᱡᱟᱝ ᱦᱚᱸ ᱡᱚᱛᱚ ᱥᱟᱠᱟᱢ ᱛᱮ ᱫᱟᱜ ᱥᱮᱴᱮᱨᱟ᱾",
      ho: "Jang do dare aa da' paip tana. Hatu re chapakal aa paip jotom oa te da' idiya, enka gi jang ho jotom sakam te da' seter aa.",
      mun: "Jang do dare aa da' paip. Hatu chapakal aa paip sabenoa te da' idiya, enka gi jang ho sabeno sakam te da' seteroa.",
    },
    kathaAlt: {
      en: "Different way: think of a bamboo ladder standing in the yard. The stem is that ladder — water climbs up it, step by step, to reach the leaves at the top. Break the ladder and nothing reaches up.",
      hi: "दूसरे तरीके से सोचो: आँगन में खड़ी बाँस की सीढ़ी। तना वही सीढ़ी है — पानी उस पर चढ़कर ऊपर की पत्तियों तक पहुँचता है। सीढ़ी टूटी तो ऊपर कुछ नहीं पहुँचेगा।",
      sat: "ᱮᱴᱟᱜ ᱞᱮᱠᱟᱛᱮ — ᱨᱟᱠᱟᱵ ᱨᱮᱱ ᱢᱟᱲ ᱥᱤᱲᱦᱤ ᱞᱮᱠᱟ ᱩᱲᱟᱹᱣ ᱢᱮ᱾ ᱡᱟᱝ ᱫᱚ ᱚᱱᱟ ᱥᱤᱲᱦᱤ ᱠᱟᱱᱟ — ᱫᱟᱜ ᱚᱱᱟ ᱛᱮ ᱨᱟᱠᱟᱵ ᱠᱟᱛᱮ ᱪᱮᱛᱟᱱ ᱥᱟᱠᱟᱢ ᱛᱮ ᱥᱮᱴᱮᱨᱟ᱾",
      ho: "Etag lekate — rakab re mad sidhi leka uduba. Jang do ena sidhi tana — da' ena te rakab kate chetan sakam te seter aa.",
      mun: "Etag lekate — akhrare tingu tan mad sidhi nel me. Jang do ena sidhi — da' ena te rakab kate chetan sakam te seteroa.",
    },
    questions: [
      {
        id: "stem-q1",
        kind: "mcq",
        prompt: {
          en: "If the stem of a plant is cut in the middle, what will happen to the leaves at the top?",
          hi: "अगर पौधे का तना बीच से कट जाए तो ऊपर की पत्तियों का क्या होगा?",
          sat: "ᱡᱩᱫᱤ ᱫᱟᱨᱮ ᱟᱜ ᱡᱟᱝ ᱛᱟᱞᱟ ᱠᱷᱚᱱ ᱦᱟᱴᱟᱣᱜᱼᱟ ᱠᱷᱟᱱ ᱪᱮᱛᱟᱱ ᱥᱟᱠᱟᱢ ᱪᱮᱫ ᱦᱩᱭᱩᱜᱼᱟ?",
          ho: "Judi dare aa jang tala ete mao ena redo chetan sakam chi hoyo aa?",
          mun: "Judi dare aa jang tala ete mao ena redo chetan sakam chi hoyoa?",
        },
        options: [
          {
            id: "a",
            label: {
              en: "They will dry up, water cannot reach them",
              hi: "वे सूख जाएँगी, पानी नहीं पहुँच पाएगा",
              sat: "ᱨᱚᱦᱚᱲᱚᱜᱼᱟ, ᱫᱟᱜ ᱵᱟᱝ ᱥᱮᱴᱮᱨᱚᱜᱼᱟ",
              ho: "Rohor oa, da' ka seter oa",
              mun: "Rohoroa, da' ka seteroa",
            },
            correct: true,
          },
          {
            id: "b",
            label: {
              en: "They will grow faster",
              hi: "वे और तेज़ी से बढ़ेंगी",
              sat: "ᱟᱨᱦᱚᱸ ᱞᱚᱜᱚᱱ ᱦᱟᱨᱟᱜᱼᱟ",
              ho: "Aur logon hara oa",
              mun: "Aur logon haraoa",
            },
          },
          {
            id: "c",
            label: {
              en: "Nothing will change",
              hi: "कुछ नहीं बदलेगा",
              sat: "ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱝ ᱵᱚᱫᱚᱞᱚᱜᱼᱟ",
              ho: "Chi ho ka badal oa",
              mun: "Chi ho ka badaloa",
            },
          },
        ],
        hint: {
          en: "Who carries the water upward?",
          hi: "पानी ऊपर कौन ले जाता है?",
          sat: "ᱫᱟᱜ ᱪᱮᱛᱟᱱ ᱚᱠᱚᱭ ᱤᱫᱤᱭᱟ?",
          ho: "Da' chetan okoe idiya?",
          mun: "Da' chetan okoe idiya?",
        },
      },
      {
        id: "stem-q2",
        kind: "voice",
        prompt: {
          en: "Say it in your own words: the stem is like which thing in your village?",
          hi: "अपने शब्दों में बोलो: तना तुम्हारे गाँव की किस चीज़ जैसा है?",
          sat: "ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ — ᱡᱟᱝ ᱫᱚ ᱟᱢᱟᱜ ᱟᱹᱛᱩ ᱨᱮᱱ ᱚᱠᱟ ᱡᱤᱱᱤᱥ ᱞᱮᱠᱟ ᱠᱟᱱᱟ?",
          ho: "Ampeya kaji te kaji me — jang do ampeya hatu re oko jinis leka tana?",
          mun: "Apeya kaji te kaji me — jang do apeya hatu re oko jinis leka?",
        },
        options: [
          {
            id: "a",
            label: {
              en: "Answer by voice",
              hi: "बोलकर उत्तर दें",
              sat: "ᱨᱚᱲ ᱠᱟᱛᱮ ᱛᱮᱞᱟ ᱮᱢ ᱢᱮ",
              ho: "Kaji kate telaa em me",
              mun: "Kaji kate telaa em me",
            },
            correct: true,
          },
        ],
        hint: {
          en: "Pipe, ladder, straw — any of these is a good answer.",
          hi: "पाइप, सीढ़ी, सरकंडा — इनमें से कोई भी सही है।",
          sat: "ᱯᱟᱭᱤᱯ, ᱥᱤᱲᱦᱤ, ᱡᱟᱸᱜᱟ — ᱡᱟᱦᱟᱸ ᱦᱚᱸ ᱴᱷᱤᱠ ᱠᱟᱱᱟ᱾",
          ho: "Paip, sidhi, khar — jaha ho thik tana.",
          mun: "Paip, sidhi, khar — jaha ho thik.",
        },
      },
    ],
  },
  {
    id: "leaves",
    label: {
      en: "Leaves",
      hi: "पत्तियाँ",
      sat: "ᱥᱟᱠᱟᱢ (Sakam)",
      ho: "Sakam",
      mun: "Sakam",
    },
    visual: "🍃",
    teacher: {
      en: "Leaves make food for the plant using sunlight, water and air. This process is called photosynthesis.",
      hi: "पत्तियाँ सूरज की रोशनी, पानी और हवा से पौधे का भोजन बनाती हैं। इसे प्रकाश-संश्लेषण कहते हैं।",
      sat: "ᱥᱟᱠᱟᱢ ᱠᱚ ᱥᱤᱸᱜᱮ ᱢᱟᱨᱥᱟᱞ, ᱫᱟᱜ ᱟᱨ ᱦᱚᱭ ᱛᱮ ᱫᱟᱨᱮ ᱟᱜ ᱡᱚᱢᱟᱜ ᱛᱮᱭᱟᱨᱟ᱾",
      ho: "Sakam ko singi marsal, da' ar hoyo te dare aa jom teyar aa.",
      mun: "Sakam ko singi marsal, da' ar hoyo te dare aa jom benaotana.",
    },
    translation: {
      en: "Leaves prepare the plant's food from sunlight, water and air.",
      hi: "पत्तियाँ धूप, पानी और हवा से पौधे का भोजन बनाती हैं।",
      sat: "ᱥᱟᱠᱟᱢ ᱫᱚ ᱥᱤᱸᱜᱮ, ᱫᱟᱜ ᱟᱨ ᱦᱚᱭ ᱛᱮ ᱫᱟᱨᱮ ᱟᱜ ᱡᱚᱢᱟᱜ ᱵᱮᱱᱟᱣᱟ᱾",
      ho: "Sakam do singi, da' ar hoyo te dare aa jom benao aa.",
      mun: "Sakam do singi, da' ar hoyo te dare aa jom benaoa.",
    },
    katha: {
      en: "A leaf is the plant's little kitchen. Your mother cooks rice on the chulha using fire, water and rice. The leaf cooks food using sunlight, water and air — that is why plants stay green and grow.",
      hi: "पत्ती पौधे की छोटी रसोई है। माँ चूल्हे पर आग, पानी और चावल से भात बनाती है। पत्ती धूप, पानी और हवा से खाना बनाती है — इसलिए पौधा हरा रहता है और बढ़ता है।",
      sat: "ᱥᱟᱠᱟᱢ ᱫᱚ ᱫᱟᱨᱮ ᱟᱜ ᱦᱩᱰᱤᱧ ᱨᱟᱱᱫᱷᱟ ᱚᱲᱟᱜ ᱠᱟᱱᱟ᱾ ᱟᱭᱳ ᱪᱩᱞᱦᱟ ᱨᱮ ᱥᱮᱸᱜᱮᱞ, ᱫᱟᱜ ᱟᱨ ᱪᱟᱣᱞᱮ ᱛᱮ ᱫᱟᱠᱟ ᱵᱮᱱᱟᱣᱟ᱾ ᱥᱟᱠᱟᱢ ᱦᱚᱸ ᱥᱤᱸᱜᱮ, ᱫᱟᱜ ᱟᱨ ᱦᱚᱭ ᱛᱮ ᱡᱚᱢᱟᱜ ᱵᱮᱱᱟᱣᱟ᱾",
      ho: "Sakam do dare aa huding rondha oa tana. Enga chulha re sengel, da' ar chaule te daka benao aa. Sakam ho singi, da' ar hoyo te jom benao aa.",
      mun: "Sakam do dare aa huring randha oa. Enga chulha re sengel, da' ar chaule te mandi benaoa. Sakam ho singi, da' ar hoyo te jom benaoa.",
    },
    kathaAlt: {
      en: "Another way: a leaf is like a solar plate on the school roof. The plate takes sunlight and makes electricity for the light. The leaf takes sunlight and makes food for the plant. No sun — no food, and the plant turns yellow.",
      hi: "दूसरा तरीका: पत्ती स्कूल की छत पर लगी सोलर प्लेट जैसी है। प्लेट धूप लेकर बिजली बनाती है, पत्ती धूप लेकर खाना बनाती है। धूप नहीं तो खाना नहीं — और पौधा पीला पड़ जाता है।",
      sat: "ᱮᱴᱟᱜ ᱞᱮᱠᱟ — ᱥᱟᱠᱟᱢ ᱫᱚ ᱥᱠᱩᱞ ᱪᱷᱟᱫ ᱨᱮᱱ ᱥᱚᱞᱟᱨ ᱯᱞᱮᱴ ᱞᱮᱠᱟ ᱠᱟᱱᱟ᱾ ᱯᱞᱮᱴ ᱥᱤᱸᱜᱮ ᱛᱮ ᱵᱤᱡᱞᱤ ᱵᱮᱱᱟᱣᱟ, ᱥᱟᱠᱟᱢ ᱥᱤᱸᱜᱮ ᱛᱮ ᱡᱚᱢᱟᱜ ᱵᱮᱱᱟᱣᱟ᱾",
      ho: "Etag leka — sakam do scool chhad re solar plate leka tana. Plate singi te bijli benao aa, sakam singi te jom benao aa.",
      mun: "Etag leka — sakam do scool chhad re solar plate leka. Plate singi te bijli benaoa, sakam singi te jom benaoa.",
    },
    questions: [
      {
        id: "leaves-q1",
        kind: "mcq",
        prompt: {
          en: "A potted plant is kept in a dark store-room for a week. Why do its leaves turn pale?",
          hi: "एक गमले का पौधा हफ़्तेभर अँधेरे कमरे में रखा गया। इसकी पत्तियाँ पीली क्यों पड़ गईं?",
          sat: "ᱢᱤᱫ ᱜᱟᱢᱞᱟ ᱨᱮᱱ ᱫᱟᱨᱮ ᱢᱤᱫ ᱦᱟᱯᱛᱟ ᱫᱷᱟᱹᱵᱤᱡ ᱱᱩᱠᱩᱲ ᱠᱚᱴᱷᱟ ᱨᱮ ᱫᱚᱦᱚ ᱮᱱᱟ᱾ ᱥᱟᱠᱟᱢ ᱪᱮᱫᱟᱜ ᱥᱟᱥᱟᱝ ᱮᱱᱟ?",
          ho: "Mid gamla re dare mid hapta nukur kotha re doho yena. Sakam chiyaga sasang yena?",
          mun: "Mid gamla dare mid hapta nukur kotha re doho yena. Sakam chiyanko sasang yena?",
        },
        options: [
          {
            id: "a",
            label: {
              en: "Without sunlight the leaves could not make food",
              hi: "धूप बिना पत्तियाँ खाना नहीं बना सकीं",
              sat: "ᱥᱤᱸᱜᱮ ᱵᱟᱝ ᱛᱟᱦᱮᱸᱱ ᱛᱮ ᱥᱟᱠᱟᱢ ᱡᱚᱢᱟᱜ ᱵᱟᱝ ᱵᱮᱱᱟᱣ ᱫᱟᱲᱮᱭᱟᱫᱟ",
              ho: "Singi bage te sakam jom ka benao dadi keda",
              mun: "Singi bano te sakam jom ka benao dadi keda",
            },
            correct: true,
          },
          {
            id: "b",
            label: {
              en: "The room was too big",
              hi: "कमरा बहुत बड़ा था",
              sat: "ᱠᱚᱴᱷᱟ ᱫᱚ ᱡᱟᱹᱥᱛᱤ ᱢᱟᱨᱟᱝ ᱛᱟᱦᱮᱸᱱᱟ",
              ho: "Kotha do marang taikena",
              mun: "Kotha do marang taikena",
            },
          },
          {
            id: "c",
            label: {
              en: "Roots stopped holding the soil",
              hi: "जड़ों ने मिट्टी पकड़ना बंद कर दिया",
              sat: "ᱨᱮᱦᱮᱫ ᱦᱟᱥᱟ ᱥᱟᱵ ᱵᱟᱝᱟᱫᱟ",
              ho: "Rehed hasa sab bagi keda",
              mun: "Rehed hasa sab bagi keda",
            },
          },
        ],
        hint: {
          en: "What does a leaf need to cook food?",
          hi: "पत्ती को खाना बनाने के लिए क्या चाहिए?",
          sat: "ᱥᱟᱠᱟᱢ ᱡᱚᱢᱟᱜ ᱵᱮᱱᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱪᱮᱫ ᱞᱟᱹᱠᱛᱤᱭᱟ?",
          ho: "Sakam jom benao nagente chi laktiya?",
          mun: "Sakam jom benao nagente chi laktia?",
        },
      },
      {
        id: "leaves-q2",
        kind: "image",
        prompt: {
          en: "Which picture shows the part that makes food for the plant?",
          hi: "कौन-सी तस्वीर उस भाग को दिखाती है जो पौधे का भोजन बनाता है?",
          sat: "ᱚᱠᱟ ᱪᱤᱛᱟᱹᱨ ᱫᱚ ᱚᱱᱟ ᱦᱟᱹᱴᱤᱧ ᱩᱫᱩᱜᱼᱟ ᱚᱠᱟᱭ ᱫᱟᱨᱮ ᱟᱜ ᱡᱚᱢᱟᱜ ᱵᱮᱱᱟᱣᱟ?",
          ho: "Oko chitar do ena hatin uduba oko dare aa jom benao aa?",
          mun: "Oko chitar ena hating uduba oko dare aa jom benaoa?",
        },
        options: [
          { id: "a", emoji: "🍃", label: { en: "Leaf", hi: "पत्ती", sat: "ᱥᱟᱠᱟᱢ", ho: "Sakam", mun: "Sakam" }, correct: true },
          { id: "b", emoji: "🌱", label: { en: "Root", hi: "जड़", sat: "ᱨᱮᱦᱮᱫ", ho: "Rehed", mun: "Rehed" } },
          { id: "c", emoji: "🎋", label: { en: "Stem", hi: "तना", sat: "ᱡᱟᱝ", ho: "Jang", mun: "Jang" } },
        ],
        hint: {
          en: "Think of the plant's kitchen.",
          hi: "पौधे की रसोई सोचो।",
          sat: "ᱫᱟᱨᱮ ᱟᱜ ᱨᱟᱱᱫᱷᱟ ᱚᱲᱟᱜ ᱩᱲᱟᱹᱣ ᱢᱮ᱾",
          ho: "Dare aa rondha oa uduba.",
          mun: "Dare aa randha oa nel me.",
        },
      },
    ],
  },
];

export const getConcept = (id: ConceptId) => CONCEPTS.find((c) => c.id === id)!;

export type Status = "understood" | "practice" | "attention";

export const STATUS_META: Record<Status, { dot: string; label: string; tone: string }> = {
  understood: { dot: "🟢", label: "Understood", tone: "text-status-good" },
  practice: { dot: "🟡", label: "Needs Practice", tone: "text-status-warn" },
  attention: { dot: "🔴", label: "Needs Attention", tone: "text-status-bad" },
};

export interface Student {
  id: string;
  name: string;
  roll: number;
  mother: LangCode;
  status: Status;
  weakConcept?: ConceptId;
}

export const STUDENTS: Student[] = [
  { id: "s1", name: "Sunita Murmu", roll: 1, mother: "sat", status: "attention", weakConcept: "roots" },
  { id: "s2", name: "Ravi Kumar", roll: 2, mother: "hi", status: "understood" },
  { id: "s3", name: "Birsa Purty", roll: 3, mother: "ho", status: "practice", weakConcept: "stem" },
  { id: "s4", name: "Anjali Soy", roll: 4, mother: "mun", status: "understood" },
  { id: "s5", name: "Mangal Hansda", roll: 5, mother: "sat", status: "practice", weakConcept: "roots" },
  { id: "s6", name: "Pooja Devi", roll: 6, mother: "hi", status: "understood" },
  { id: "s7", name: "Somra Topno", roll: 7, mother: "mun", status: "attention", weakConcept: "roots" },
  { id: "s8", name: "Rekha Kisku", roll: 8, mother: "sat", status: "understood" },
  { id: "s9", name: "Ajay Bodra", roll: 9, mother: "ho", status: "practice", weakConcept: "leaves" },
  { id: "s10", name: "Sita Mahto", roll: 10, mother: "hi", status: "understood" },
  { id: "s11", name: "Kartik Munda", roll: 11, mother: "mun", status: "understood" },
  { id: "s12", name: "Lakhi Baskey", roll: 12, mother: "sat", status: "understood" },
];

export interface Lesson {
  id: string;
  grade: string;
  subject: string;
  title: string;
  titleHi: string;
  minutes: number;
  concepts: ConceptId[];
  progress: number;
  offline: boolean;
}

export const LESSONS: Lesson[] = [
  {
    id: "evs-plant",
    grade: "Grade 3",
    subject: "EVS",
    title: "Parts of a Plant",
    titleHi: "पौधे के भाग",
    minutes: 35,
    concepts: ["roots", "stem", "leaves"],
    progress: 40,
    offline: true,
  },
  {
    id: "evs-water",
    grade: "Grade 3",
    subject: "EVS",
    title: "Water in Our Village",
    titleHi: "हमारे गाँव का पानी",
    minutes: 30,
    concepts: ["roots"],
    progress: 0,
    offline: true,
  },
  {
    id: "math-shapes",
    grade: "Grade 2",
    subject: "Mathematics",
    title: "Shapes Around Us",
    titleHi: "हमारे आसपास आकार",
    minutes: 25,
    concepts: ["stem"],
    progress: 100,
    offline: false,
  },
  {
    id: "lang-story",
    grade: "Grade 4",
    subject: "Language",
    title: "The Honest Woodcutter",
    titleHi: "ईमानदार लकड़हारा",
    minutes: 40,
    concepts: ["leaves"],
    progress: 0,
    offline: true,
  },
];
