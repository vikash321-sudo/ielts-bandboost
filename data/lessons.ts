import type { Lesson } from "@/lib/types";

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "True / False / Not Given Strategy",
    skill: "Reading",
    level: "Beginner",
    duration: "11 min",
    videoId: "dQw4w9WgXcQ",
    teacher: "Curated IELTS Lesson",
    notes: [
      "True means the statement agrees with the passage.",
      "False means the passage gives opposite information.",
      "Not Given means the passage does not clearly mention it.",
      "Do not use your own knowledge. Use only the passage."
    ],
    practiceSetId: 101
  },
  {
    id: 2,
    title: "Matching Headings Without Panic",
    skill: "Reading",
    level: "Intermediate",
    duration: "13 min",
    videoId: "dQw4w9WgXcQ",
    teacher: "Curated IELTS Lesson",
    notes: [
      "Read all headings first.",
      "Focus on the main idea, not one repeated word.",
      "Cross out headings after using them.",
      "Leave difficult paragraphs and return later."
    ],
    practiceSetId: 102
  },
  {
    id: 3,
    title: "Listening Fill in the Blanks",
    skill: "Listening",
    level: "Beginner",
    duration: "9 min",
    videoId: "dQw4w9WgXcQ",
    teacher: "Curated IELTS Lesson",
    notes: [
      "Read the word limit carefully.",
      "Predict the type of answer before listening.",
      "Check spelling because spelling mistakes lose marks.",
      "Listen for signpost words and corrections."
    ],
    practiceSetId: 201
  },
  {
    id: 4,
    title: "Writing Task 2 Basic Essay Structure",
    skill: "Writing",
    level: "Beginner",
    duration: "14 min",
    videoId: "dQw4w9WgXcQ",
    teacher: "Curated IELTS Lesson",
    notes: [
      "Write a clear introduction with paraphrase and position.",
      "Use two body paragraphs with one main idea each.",
      "Support ideas with explanation and examples.",
      "End with a direct conclusion."
    ],
    practiceSetId: 301
  },
  {
    id: 5,
    title: "Speaking Part 2 Cue Card Method",
    skill: "Speaking",
    level: "Beginner",
    duration: "10 min",
    videoId: "dQw4w9WgXcQ",
    teacher: "Curated IELTS Lesson",
    notes: [
      "Use the one-minute preparation time to make quick keywords.",
      "Answer all bullet points but do not sound robotic.",
      "Extend your answer with reasons, examples, and feelings.",
      "Aim to speak naturally for around two minutes."
    ],
    practiceSetId: 401
  }
];
