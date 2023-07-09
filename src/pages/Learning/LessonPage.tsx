import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Outlet } from "react-router-dom";
import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";
import type {
  Module,
} from "@/types";

import LessonNavigation from "@/pages/Learning/components/LessonNavigation";
import "@/pages/Learning/LessonPage.scss";

export default function LessonPage() {
  const { course, id = "", step = "" } = useParams();
  const [lesson, setLesson] = useState<Module | null>(null);
  const [activities, setActivities] = useState<Module[]>([]);
  const [position, setPosition] = useState<string>(step);

  const navigate = useNavigate();

  const navigateToStep = useCallback( (step?: string) => {
    if (!step) {
      return 
    }
    setPosition(step);
    navigate(`/learning/course/${course}/lesson/${id}/step/${step}`);
  }, [course, id, navigate]);
  
  const busy = useBusy();

  useEffect(() => {
    busy(true);
    const fetchLesson = modules.fetchOne(id).then((lesson) => {
      setLesson(lesson);
    });
    const fetchActivities = modules.fetchChildren(id).then(setActivities);
    Promise.all([fetchLesson, fetchActivities])
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy, id]);

  useEffect(() => {
    if (activities.length && !activities.some(e => e.id === position)) {
      const first = activities.at(0)
      first?.id && navigateToStep(first.id)
    }
  }, [position, activities, navigateToStep])

  const nextActivity = () => {
    const index = activities.findIndex(e => e.id === position)
    const next = activities[index+1]?.id

    if (next) {
      navigateToStep(next);
    } else {
      alert("Done");
    }
  };

  if (!lesson) {
    return null;
  }
  if (!activities.length) {
    return <div>Loading...</div>;
  }
  const activity = activities.find(e => e.id === position)?.activity
    
  return (
    <div className="container-fluid">
      <h1>Lesson {lesson.name} in progress</h1>
      <LessonNavigation
        count = {activities.length}
        position={activities.findIndex(e => e.id === position)}
        onNavigate={(position) => navigateToStep(activities[position]?.id)}
      />
      <Outlet context={{activity: activity, onDone: nextActivity}}/>
    </div>
  );
}
