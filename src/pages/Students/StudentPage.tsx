import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import * as users from "@/services/users";

import useErrorHandler from "@/utils/ErrorHook";
import useBusy from "@/utils/BusyHook";

import currentProgress from "@/services/currentProgress";
import deleteCourseProgress from "@/pages/Students/deleteCourseProgress";
import GenericLoadingState from "@/components/GenericLoadingState";
import Trash from "@/components/icons/Trash";

import type { CourseProgress } from "@/services/currentProgress";
import type { User } from "@/types";

export default function StudentPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [wordsToRepeat, setWordsToRepeat] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const { uid = "" } = useParams();
  const errorHandler = useErrorHandler();
  const { t } = useTranslation();
  const busy = useBusy();

  const fetchAll = async (uid: string) => {
    const [current, user] = await Promise.all([
      currentProgress(uid),
      users.findWithUid(uid),
    ]);
    setCourses(current.courses);
    setWordsToRepeat(current.wordsToRepeat);
    setUser(user);
  };

  useEffect(() => {
    setLoading(true);
    fetchAll(uid)
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, [uid, errorHandler]);

  const deleteProgress = async (moduleId: string) => {
    if (!confirm("Really???")) {
      return;
    }
    busy(true);
    await deleteCourseProgress(uid, moduleId)
      .then(() => {
        const updated = courses.filter(
          (e) => e.progress?.moduleId !== moduleId
        );
        setCourses(updated);
      })
      .catch(errorHandler)
      .finally(() => busy(false));
  };

  if (loading) {
    return <GenericLoadingState />;
  }

  const startedCourses = courses.filter((e) => e.progress);

  return (
    <div className="container-fluid mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item" aria-current="page">
            <Link to="/students">{t("StudentPage.root")}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {user?.name}
          </li>
        </ol>
      </nav>

      <h1>{t("StudentPage.title")}</h1>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">{t("StudentPage.table.course")}</th>
            <th scope="col">{t("StudentPage.table.started-at")}</th>
            <th scope="col">{t("StudentPage.table.finished-at")}</th>
          </tr>
        </thead>
        <tbody>
          {!startedCourses.length && (
            <tr>
              <th colSpan={4}>{t("StudentPage.table.empty")}</th>
            </tr>
          )}
          {startedCourses.map((course) => (
            <tr>
              <td>{course.name}</td>
              <td>{dayjs(course.progress?.startedAt).format("LLL")}</td>
              <td>
                {course.progress?.finishedAt
                  ? dayjs(course.progress?.finishedAt).format("LLL")
                  : "-"}
              </td>
              <td className="text-end">
                <span
                  className="badge bg-danger ms-3"
                  onClick={() =>
                    course.progress?.moduleId &&
                    deleteProgress(course.progress?.moduleId)
                  }
                >
                  <Trash />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {t("StudentPage.repeat", { words: wordsToRepeat })}
    </div>
  );
}
