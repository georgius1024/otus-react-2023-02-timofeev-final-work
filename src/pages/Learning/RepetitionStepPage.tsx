import { useOutletContext } from "react-router-dom";

// import type {
//   Activity,
//   SlideActivity,
//   WordActivity,
//   PhraseActivity,
// } from "@/types";

import type { RepetitionStep } from "@/pages/Learning/components/ActivityTypes";

type ContextType = {
  step: RepetitionStep
  onDone: () => void
}

// import SlideActivityWidget from "@/pages/Learning/components/SlideActivityWidget";
// import WordActivityWidget from "@/pages/Learning/components/WordActivityWidget";
// import PhraseActivityWidget from "@/pages/Learning/components/PhraseActivityWidget";


export default function RepetitionStepPage() {
  const {step, onDone} = useOutletContext<ContextType>()

  if (!step) {
    return (
      <div className="alert alert-danger" role="alert">
        Activity is missed
      </div>
    );
  }

  return (
    <div>
      <div>{JSON.stringify(step.id)}</div>
      <button className="btn btn-primary" onClick={onDone}>
        Next
      </button>
      {/* {step.type === "slide" && (
        <SlideActivityWidget
          activity={step as SlideActivity}
          onDone={onDone}
        />
      )}
      {step.type === "word" && (
        <WordActivityWidget
          activity={step as WordActivity}
          onDone={onDone}
        />
      )}
      {step.type === "phrase" && (
        <PhraseActivityWidget
          activity={step as PhraseActivity}
          onDone={onDone}
        />
      )} */}
    </div>
  );
}