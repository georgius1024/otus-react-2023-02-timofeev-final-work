import type { WordActivity } from "@/types";

export type OnDone = () => void;
export type OnSolved = (correct: boolean) => void;

export type StepType =
  | "learn"
  | "translate-direct"
  | "translate-reverse"
  | "puzzle";

export type WordActivityProps = {
  activity: WordActivity;
  onDone: OnDone;
};

export type WordActivityStepProps = {
  activity: WordActivity;
  onSolved: OnSolved;
};

export type WordActivityDispatcherProps = WordActivityStepProps & {
  step: StepType;
};
