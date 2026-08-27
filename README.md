# Katha Classroom

Create a fully working responsive web-app prototype called KATHA for laptop, desktop and iPad, designed as a realistic AI-powered vernacular education platform for Indian primary-school classrooms.

Brand: KATHA
Tagline: “Learn in the language that feels like home.”

Make it look like a real, trustworthy government-school EdTech product — clean minimal UI, professional typography, subtle colors, simple icons, generous spacing and realistic Indian classroom content. Avoid futuristic AI graphics, excessive gradients, glowing effects and unnecessary cards.

CORE IDEA

KATHA is not just a translation tool. It translates a teacher's lesson into a child's mother tongue, then adapts the explanation to the child's age, language and local context, checks whether they understood, and explains it differently if they struggle.

Teacher Speech → Speech-to-Text → Translation → Vernacular Pedagogy → Text + Audio + Visual → Understanding Check → Adaptive Re-explanation

LANGUAGES

Support English, Hindi, Santhali, Ho and Mundari.

All 5 languages must be fully interchangeable:

Any language can be the teacher/source language.

Any language can be the student's target/mother tongue.

Allow changing both languages at any time.

Translation output must visibly change according to the selected target language.

Do not limit the prototype to Hindi/Marathi.

Use realistic sample translations for demonstration where live translation is unavailable.

MAIN FLOW

Login → Teacher Dashboard → Select Lesson → Language Setup → Live Classroom → Understanding Check → Results → Adaptive Re-explanation → Teacher Analytics

SCREENS & FUNCTIONAL FEATURES

1. Login

KATHA branding + tagline

Teacher login

Clean professional layout

2. Teacher Dashboard

Class overview

Today's lesson

Student understanding summary

Learning gaps

Language selection

Start Live Classroom

🟢 Understood / 🟡 Needs Practice / 🔴 Needs Attention

3. Lesson Selection
Use realistic content such as:
Grade 3 EVS — “Parts of a Plant”

Lesson duration

Start/continue lesson

4. Language Setup

Source/teacher language dropdown

Target/student mother tongue dropdown

English, Hindi, Santhali, Ho, Mundari available in BOTH

Clearly show selected language pair

Offline availability indicator

5. Live Classroom
Create a functional demonstration of:
Teacher Speech → Transcription → Translation → KATHA Explanation

Show:

Microphone / text input

Live transcription in source language

Actual translated text in selected target language

“KATHA Explanation” separately from translation

Play Audio / TTS button

Simple child-friendly visual

The explanation must:

Use age-appropriate vocabulary

Simplify difficult concepts

Use familiar local examples, stories or analogies

Be different from the literal translation

6. Understanding Check
After the lesson, automatically provide 2–3 varied questions:

MCQ

Image-based question

Voice-answer option

Show:
🟢 Understood
🟡 Needs Practice
🔴 Needs Re-explanation

Questions should test the concept, not just memorization.

7. Adaptive “Explain Again, Differently”
This is KATHA's key feature.

When a student answers incorrectly:

Do NOT repeat the same explanation.

Do NOT repeat the same question.

Identify the difficult concept.

Give a new simpler explanation using a different example, analogy or story.

Then generate a new question testing the same concept in a different way.

Allow the student to try again.

Example:
First explanation: “Roots hold the plant like an anchor.”
Second explanation: “Roots are like your feet — they keep you from falling.”

The second question must also be different.

8. Teacher Analytics
Keep it simple and useful:

Number of students understood

Needs Practice

Needs Attention

Concept-level learning gaps

Recommended concept for re-explanation

Example:
Roots — 🔴 Needs Attention
Stem — 🟡 Needs Practice
Leaves — 🟢 Understood

9. Translation Feedback
Add “Suggest Correction” wherever translated content appears.

Teacher/native speaker can edit incorrect translation

Submit correction

Show confirmation

Make it clear this feedback can improve future translations

10. Offline Mode
Show realistic offline functionality:

Lessons can be cached

Translations can be cached

Assessments can be cached

Display Available Offline

Show Cached → Syncing → Synced status when connectivity returns

PROTOTYPE REQUIREMENT

This must be a working clickable prototype, not static screens.

Make language switching, navigation, lesson selection, quiz answers, adaptive re-explanation, translation feedback, audio buttons and offline states interactive.

If real AI/API services cannot be connected, use realistic preloaded sample responses, but the UI must behave as if the system is working.

MOST IMPORTANT

The prototype must clearly communicate KATHA's unique value:

“KATHA doesn't just translate the lesson. It teaches the concept in the child's language and context, checks understanding, and explains it differently when the child struggles.”

Keep everything practical, accessible, responsive and deployable in real Indian government schools.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://katha-samajh-seekho.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/81201eed-e9e8-4521-b7bb-81d4fec93c4f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
