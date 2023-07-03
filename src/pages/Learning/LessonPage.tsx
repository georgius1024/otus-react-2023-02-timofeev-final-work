import { useEffect, useState } from "react";
import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";
import type { Module } from "@/types";

import { useParams } from "react-router-dom";
export default function LessonPage() {
  const {id = ''} = useParams()
  const [lesson, setLesson] = useState<Module | null>(null)
  const [activities, setActivities] = useState<Module[]>([])

  const busy = useBusy();

  useEffect(() => {
    busy(true);
    const fetchLesson = modules.fetchOne(id)
    .then((lesson) => {
      setLesson(lesson);
    })
    const fetchActivities = modules.fetchChildren(id)
    .then((activities) => {
      setActivities(activities);
    })
    Promise.all([fetchLesson, fetchActivities])
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy, id]);
  if (!lesson) {
    return null
  }
  return (
    <div className="container-fluid">
      <h1>Lesson {lesson.name} in progress</h1>
      <ul className="list-group">
        {activities.map((activity) => (
          <li className="list-group-item">
            {activity.name}
          </li>
        ))}
      </ul>
    </div>
  );

}