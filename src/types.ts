export type Auth = {
  uid: string | null;
  email: string | null;
  access?: string;
  providerData?: unknown;
};

export type Student = {
  id?: string;
  uid: string;
  email: string;
};

export type ErrorResponse = {
  error: {
    message: string;
  };
};

export type WordActivity = {
  type: "word";
  word: string;
  translation: string;
  context?: string;
  synonyms?: string;
};

export type PhraseActivity = {
  type: "phrase";
  phrase: string;
  translation: string;
};

export type SlideActivity = {
  type: "slide";
  header: string;
  slide: string;
};

export type Activity = WordActivity | PhraseActivity | SlideActivity;
export type ActivityType = "word" | "phrase" | "slide";
export type ModuleType = "course" | "lesson" | "activity";
export type Module = {
  id?: string;
  parent: string;
  name: string;
  type: ModuleType;
  position?: number;
  activity?: Activity;
};

export type ProgressRecord = {
  id?: string;
  moduleId: string;
  userId: string;
  startedAt: number;
  finishedAt?: number | null;
};

export type RepetitionRecord = {
  id?: string;
  activityId: string;
  userId: string;
  startedAt: number;
  repeatCount: number;
  scheduledAt: number;
  finishedAt: number;
};
