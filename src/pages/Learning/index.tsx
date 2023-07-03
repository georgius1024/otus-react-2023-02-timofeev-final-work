import { useEffect, useState } from "react";
import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";
import type { Module } from "@/types";
import { Link } from "react-router-dom";

export default function LearningIndex() {
  const [courses, setCourses] = useState<Module[]>([]);
  const busy = useBusy();
  useEffect(() => {
    busy(true);
    modules
      .fetchChildren("")
      .then((modules) => {
        setCourses(modules);
      })
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy]);

  return (
    <div className="container-fluid">
      <h1>Choose course</h1>
      <ul className="list-group">
        {courses.map((course) => (
          <li className="list-group-item">
            <Link to={`/learning/course/${course.id}`}>{course.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
