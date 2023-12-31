import type { WordActivity, PhraseActivity, Activity, RepetitionRecord } from "@/types";

export type OnDone = () => void;
export type OnSolved = (correct: boolean) => void;

export type StepType =
  | "learn"
  | "translate-direct"
  | "translate-reverse"
  | "puzzle";

export type ActivityProps<T> = {
  activity: T;
  onDone: OnDone;
}

export type ActivityStepProps<T> = {
  activity: T;
  variants?: string[],
  onSolved: OnSolved;
}

export type ActivityDispatcherProps<T> = {
  activity: T;
  step: StepType;
  onSolved: OnSolved;
}

export type WordActivityProps = ActivityProps<WordActivity>
export type WordActivityStepProps = ActivityStepProps<WordActivity>
export type WordActivityDispatcherProps = ActivityDispatcherProps<WordActivity>

export type PhraseActivityProps = ActivityProps<PhraseActivity>
export type PhraseActivityStepProps = ActivityStepProps<PhraseActivity>
export type PhraseActivityDispatcherProps = ActivityDispatcherProps<PhraseActivity>


export type RepetitionStep = {
  id: string;
  moduleId: string;
  type: StepType;
  activity: Activity;
  repetition: RepetitionRecord;
};

export type LessonStep = {
  id: string;
  moduleId: string;
  type: StepType;
  activity: Activity;
};
