import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";
import type {
  Module,
  Activity,
  SlideActivity,
  WordActivity,
  PhraseActivity,
} from "@/types";

import LessonNavigation from "@/pages/Learning/components/LessonNavigation";
import SlideActivityWidget from "@/pages/Learning/components/SlideActivityWidget";
import WordActivityWidget from "@/pages/Learning/components/WordActivityWidget";
import PhraseActivityWidget from "@/pages/Learning/components/PhraseActivityWidget";

import "@/pages/Learning/LessonPage.scss"

export default function LessonPage() {
  const { id = "" } = useParams();
  const [lesson, setLesson] = useState<Module | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [position, setPosition] = useState<number>(0);

  const busy = useBusy();

  useEffect(() => {
    busy(true);
    const fetchLesson = modules.fetchOne(id).then((lesson) => {
      setLesson(lesson);
    });
    const fetchActivities = modules.fetchChildren(id).then((modules) => {
      setActivities(
        modules.map((m) => m.activity).filter(Boolean) as Activity[]
      );
    });
    Promise.all([fetchLesson, fetchActivities])
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy, id]);

  const nextActivity = () => {
    position < activities.length - 1 && setPosition(position + 1);
    position === activities.length - 1 && alert('Done');
  };

  if (!lesson) {
    return null;
  }
  if (!activities.length) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container-fluid">
      <h1>Lesson {lesson.name} in progress</h1>
      <LessonNavigation
        count={activities.length}
        position={position}
        onNavigate={setPosition}
      />
      {activities[position].type === "slide" && (
        <SlideActivityWidget
          activity={activities[position] as SlideActivity}
          onDone={nextActivity}
        />
      )}
      {activities[position].type === "word" && (
        <WordActivityWidget
          activity={activities[position] as WordActivity}
          onDone={nextActivity}
        />
      )}
      {activities[position].type === "phrase" && (
        <PhraseActivityWidget
          activity={activities[position] as PhraseActivity}
          onDone={nextActivity}
        />
      )}
    </div>
  );
}
