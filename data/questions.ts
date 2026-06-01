import type { PracticeQuestion } from "@/lib/types";

export const questions: PracticeQuestion[] = [
  {
    id: 1,
    practiceSetId: 101,
    skill: "Reading",
    type: "True/False/Not Given",
    prompt: "The passage clearly states that IELTS Reading has only multiple-choice questions.",
    options: ["True", "False", "Not Given"],
    answer: "False",
    explanation: "IELTS Reading has several question types, not only multiple-choice questions."
  },
  {
    id: 2,
    practiceSetId: 101,
    skill: "Reading",
    type: "True/False/Not Given",
    prompt: "If the passage does not mention the information, the answer should be Not Given.",
    options: ["True", "False", "Not Given"],
    answer: "True",
    explanation: "Not Given means the statement cannot be confirmed from the passage."
  },
  {
    id: 3,
    practiceSetId: 101,
    skill: "Reading",
    type: "True/False/Not Given",
    prompt: "Students should use their general knowledge to answer IELTS Reading questions.",
    options: ["True", "False", "Not Given"],
    answer: "False",
    explanation: "IELTS Reading answers must come from the passage, not outside knowledge."
  },
  {
    id: 4,
    practiceSetId: 102,
    skill: "Reading",
    type: "Matching Headings",
    prompt: "Which heading best matches a paragraph about the main reason students lose marks in IELTS Reading?",
    options: ["Common Reading Mistakes", "History of IELTS", "Writing Band Scores", "Speaking Fluency"],
    answer: "Common Reading Mistakes",
    explanation: "The paragraph is about mistakes in Reading, so the main idea is common reading mistakes."
  },
  {
    id: 5,
    practiceSetId: 201,
    skill: "Listening",
    type: "Fill in the Blanks",
    prompt: "In IELTS Listening, spelling mistakes are counted as ____ answers.",
    options: ["correct", "wrong", "optional", "extra"],
    answer: "wrong",
    explanation: "Even if the idea is right, incorrect spelling can make the answer wrong."
  },
  {
    id: 6,
    practiceSetId: 201,
    skill: "Listening",
    type: "Multiple Choice",
    prompt: "Before listening, what should you do first?",
    options: ["Read the questions", "Close the paper", "Guess randomly", "Ignore word limits"],
    answer: "Read the questions",
    explanation: "Reading questions first helps you predict the type of information needed."
  },
  {
    id: 7,
    practiceSetId: 301,
    skill: "Writing",
    type: "Essay Structure",
    prompt: "What should a strong IELTS Task 2 introduction usually include?",
    options: ["Paraphrase and clear position", "Only examples", "Only conclusion", "Random quotes"],
    answer: "Paraphrase and clear position",
    explanation: "A good introduction usually paraphrases the question and gives a clear position."
  },
  {
    id: 8,
    practiceSetId: 401,
    skill: "Speaking",
    type: "Cue Card Strategy",
    prompt: "What is the best use of preparation time in Speaking Part 2?",
    options: ["Write full sentences", "Make quick keywords", "Stay silent", "Memorize grammar rules"],
    answer: "Make quick keywords",
    explanation: "Keywords help you speak naturally without reading a memorized answer."
  }
];
