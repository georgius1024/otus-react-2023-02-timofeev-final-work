import {
  WordActivityDispatcherProps,
} from "@/pages/Learning/components/ActivityTypes";

import WordLearnStep from "@/pages/Learning/components/WordLearnStep";
import WordDirectTranslationStep from "@/pages/Learning/components/WordDirectTranslationStep";
import WordReverseTranslationStep from "@/pages/Learning/components/WordReverseTranslationStep";
import WordPuzzleStep from "@/pages/Learning/components/WordPuzzleStep";

export default function WordActivityDispatcher(props: WordActivityDispatcherProps) {
  switch (props.step) {
    case "learn":
      return (
        <WordLearnStep activity={props.activity} onSolved={props.onSolved} />
      );
    case "translate-direct":
      return (
        <WordDirectTranslationStep
          activity={props.activity}
          onSolved={props.onSolved}
        />
      );
    case "translate-reverse":
      return (
        <WordReverseTranslationStep
          activity={props.activity}
          onSolved={props.onSolved}
        />
      );
    case "puzzle":
      return (
        <WordPuzzleStep activity={props.activity} onSolved={props.onSolved} />
      );
  }
  return null;
}
