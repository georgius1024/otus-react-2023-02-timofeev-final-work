import { useEffect, useState } from "react";
import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";
import type { Module } from "@/types";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function CoursePage() {
  const {id = ''} = useParams()
  const [course, setCourse] = useState<Module | null>(null)
  const [lessons, setLessons] = useState<Module[]>([])

  const busy = useBusy();

  useEffect(() => {
    busy(true);
    const fetchCourse = modules.fetchOne(id)
    .then((course) => {
      setCourse(course);
    })
    const fetchLessons = modules.fetchChildren(id)
    .then((lessons) => {
      setLessons(lessons);
    })
    Promise.all([fetchCourse, fetchLessons])
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy, id]);
  if (!course) {
    return null
  }
  return (
    <div className="container-fluid">
      <h1>Course {course.name} lessons</h1>
      <ul className="list-group">
        {lessons.map((lesson) => (
          <li className="list-group-item">
            <Link to={`/learning/course/${course.id}/lesson/${lesson.id}`}>{lesson.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );

}