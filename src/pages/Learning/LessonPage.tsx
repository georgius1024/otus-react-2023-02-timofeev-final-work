import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Outlet } from "react-router-dom";
import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";
import type {
  Module,
  Activity,
} from "@/types";

import LessonNavigation from "@/pages/Learning/components/LessonNavigation";
import "@/pages/Learning/LessonPage.scss";

export default function LessonPage() {
  const { course, id = "", step = "" } = useParams();
  const [lesson, setLesson] = useState<Module | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [position, setPosition] = useState<number>(+step);

  const navigate = useNavigate();

  const navigateToStep = useCallback( (step: number) => {
    setPosition(step);
    navigate(`/learning/course/${course}/lesson/${id}/step/${step}`);
  }, [course, id, navigate]);
  
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

  useEffect(() => {
    step || navigateToStep(0)    
  }, [step, activities, navigateToStep])
  
  const nextActivity = () => {
    position < activities.length - 1 && navigateToStep(position + 1);
    position === activities.length - 1 && alert("Done");
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
        onNavigate={navigateToStep}
      />
      <Outlet context={{activity: activities[position], onDone: nextActivity}}/>
    </div>
  );
}
