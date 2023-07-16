import { PhraseActivityDispatcherProps } from "@/pages/Learning/components/ActivityTypes";

import PhraseLearnStep from "@/pages/Learning/components/PhraseLearnStep";
import PhraseDirectTranslationStep from "@/pages/Learning/components/PhraseDirectTranslationStep";
import PhraseReverseTranslationStep from "@/pages/Learning/components/PhraseReverseTranslationStep";
import PhrasePuzzleStep from "@/pages/Learning/components/PhrasePuzzleStep";

import "@/pages/Learning/components/ActivityStyles.scss"

export default function PhraseActivityDispatcher(
  props: PhraseActivityDispatcherProps
) {
  switch (props.step) {
    case "learn":
      return (
        <PhraseLearnStep activity={props.activity} onSolved={props.onSolved} />
      );
    case "translate-direct":
      return (
        <PhraseDirectTranslationStep
          activity={props.activity}
          onSolved={props.onSolved}
        />
      );
    case "translate-reverse":
      return (
        <PhraseReverseTranslationStep
          activity={props.activity}
          onSolved={props.onSolved}
        />
      );
    case "puzzle":
      return (
        <PhrasePuzzleStep activity={props.activity} onSolved={props.onSolved} />
      );
  }
  return null;
}
