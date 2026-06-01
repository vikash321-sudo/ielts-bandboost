export type Skill = "Listening" | "Reading" | "Writing" | "Speaking" | "Vocabulary" | "Grammar";

export type Lesson = {
  id: number;
  title: string;
  skill: Skill;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  videoId: string;
  teacher: string;
  notes: string[];
  practiceSetId: number;
};

export type PracticeQuestion = {
  id: number;
  practiceSetId: number;
  skill: Skill;
  type: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type ProgressRecord = {
  date: string;
  skill: Skill;
  score: number;
  total: number;
  band: number;
  weakArea: string;
};

export type VocabularyWord = {
  id: number;
  word: string;
  meaning: string;
  example: string;
  category: "Writing Task 1" | "Writing Task 2" | "Speaking" | "General";
};
