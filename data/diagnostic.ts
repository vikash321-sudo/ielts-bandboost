export type DiagnosticQuestion = {
  id: number;
  skill: "Reading" | "Listening" | "Grammar" | "Vocabulary";
  type: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 1,
    skill: "Reading",
    type: "True/False/Not Given",
    prompt:
      "A passage says: 'Many students prefer online classes because they save travel time.' Statement: Online classes are preferred by some students because they reduce travel time.",
    options: ["True", "False", "Not Given"],
    answer: "True",
    explanation:
      "The statement matches the passage. 'Save travel time' means reduce travel time."
  },
  {
    id: 2,
    skill: "Reading",
    type: "True/False/Not Given",
    prompt:
      "A passage says: 'The library opens at 8 AM on weekdays.' Statement: The library opens at 8 AM every day.",
    options: ["True", "False", "Not Given"],
    answer: "False",
    explanation:
      "The passage only says weekdays. 'Every day' includes weekends, so the statement is false."
  },
  {
    id: 3,
    skill: "Listening",
    type: "Detail Recognition",
    prompt:
      "In a listening test, a speaker says: 'The meeting has been moved from Monday to Wednesday.' What is the new meeting day?",
    options: ["Monday", "Tuesday", "Wednesday", "Friday"],
    answer: "Wednesday",
    explanation:
      "The key phrase is 'moved from Monday to Wednesday'. The new day is Wednesday."
  },
  {
    id: 4,
    skill: "Listening",
    type: "Number Recognition",
    prompt:
      "A speaker says: 'The course fee is one hundred and fifty dollars.' What is the correct amount?",
    options: ["$15", "$50", "$150", "$500"],
    answer: "$150",
    explanation:
      "'One hundred and fifty' means 150."
  },
  {
    id: 5,
    skill: "Grammar",
    type: "Sentence Accuracy",
    prompt: "Choose the correct sentence.",
    options: [
      "Many people believes online learning is useful.",
      "Many people believe online learning is useful.",
      "Many people believing online learning is useful.",
      "Many people believed online learning is useful."
    ],
    answer: "Many people believe online learning is useful.",
    explanation:
      "The subject 'many people' is plural, so the verb should be 'believe'."
  },
  {
    id: 6,
    skill: "Grammar",
    type: "Preposition",
    prompt: "Choose the correct option: Students should focus ___ improving their writing.",
    options: ["in", "on", "at", "for"],
    answer: "on",
    explanation:
      "The correct phrase is 'focus on'."
  },
  {
    id: 7,
    skill: "Vocabulary",
    type: "Academic Word Meaning",
    prompt: "What does 'significant' mean in IELTS writing?",
    options: ["Small", "Important or noticeable", "Dangerous", "Temporary"],
    answer: "Important or noticeable",
    explanation:
      "'Significant' means important, large enough to notice, or meaningful."
  },
  {
    id: 8,
    skill: "Vocabulary",
    type: "Academic Word Meaning",
    prompt: "What is the best synonym of 'decline' in Task 1 writing?",
    options: ["Increase", "Decrease", "Remain stable", "Improve"],
    answer: "Decrease",
    explanation:
      "In IELTS Task 1, 'decline' usually means decrease or fall."
  }
];