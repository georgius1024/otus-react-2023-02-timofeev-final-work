import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import currentProgress from "@/pages/Home/currentProgress";
import useUid from "@/utils/UidHook";

import GenericLoadingState from "@/components/GenericLoadingState";

import type { CourseProgress } from "@/pages/Home/currentProgress";
export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [wordsToRepeat, setWordsToRepeat] = useState(0);

  const uid = useUid();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    currentProgress(uid())
      .then((response) => {
        setCourses(response.courses);
        setWordsToRepeat(response.wordsToRepeat);
      })
      .finally(() => setLoading(false));
  }, [uid]);

  if (loading) {
    return <GenericLoadingState />;
  }

  const unstarted = courses.filter((e) => !e.progress);
  const unfinished = courses.filter(
    (e) => e.progress && !e.progress.finishedAt
  );

  const continueCourse = (id: string) => {
    navigate(`/learning/course/${id}`);
  };

  const warningIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="25"
      role="img"
      aria-label="Warning:"
    >
      <path
        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <div className="container-fluid mt-4">
      <h1>{t("HomePage.title")}</h1>

      {wordsToRepeat > 0 && (
        <div className="alert alert-primary my-3" role="alert">
          <div className="d-flex flex-row align-items-center">
            <div className="text-danger">{warningIcon()}</div>
            <div className="mx-3 flex-grow-1">
              {t("HomePage.repeat.description", { wordsToRepeat })}
            </div>
            <Link
              role="button"
              className="btn btn-primary btn-sm"
              to="/learning/repetition"
            >
              {t("HomePage.repeat.action")}
            </Link>
          </div>
        </div>
      )}
      {unfinished.length > 0 &&
        unfinished.map((e) => {
          return (
            <div className="alert alert-primary my-3" role="alert" key={e.id}>
              <div className="d-flex flex-row align-items-center">
                <div className="text-danger">{warningIcon()}</div>
                <div className="mx-3 flex-grow-1">
                  {t("HomePage.continue.description", { course: e.name })}
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => e.id && continueCourse(e.id)}
                >
                  {t("HomePage.continue.action")}
                </button>
              </div>
            </div>
          );
        })}
      {unstarted && (
        <>
          <h2>{t("HomePage.unstarted.title")}</h2>
          <p>{t("HomePage.unstarted.description")}</p>
          <Link role="button" to="/learning" className="btn btn-link">
            {t("HomePage.unstarted.action")}{" "}
          </Link>
        </>
      )}
    </div>
  );
}
