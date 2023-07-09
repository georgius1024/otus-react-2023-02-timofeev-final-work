import { useOutletContext } from "react-router-dom";

import type {
  Activity,
  SlideActivity,
  WordActivity,
  PhraseActivity,
} from "@/types";

type ContextType = {
  activity: Activity
  onDone: () => void
}

import SlideActivityWidget from "@/pages/Learning/components/SlideActivityWidget";
import WordActivityWidget from "@/pages/Learning/components/WordActivityWidget";
import PhraseActivityWidget from "@/pages/Learning/components/PhraseActivityWidget";

export default function LessonPageStep() {
  const {activity, onDone} = useOutletContext<ContextType>()
  if (!activity) {
    return (
      <div className="alert alert-danger" role="alert">
        Activity is missed
      </div>
    );
  }

  return (
    <div>
      {activity.type === "slide" && (
        <SlideActivityWidget
          activity={activity as SlideActivity}
          onDone={onDone}
        />
      )}
      {activity.type === "word" && (
        <WordActivityWidget
          activity={activity as WordActivity}
          onDone={onDone}
        />
      )}
      {activity.type === "phrase" && (
        <PhraseActivityWidget
          activity={activity as PhraseActivity}
          onDone={onDone}
        />
      )}
    </div>
  );
}
