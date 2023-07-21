import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";

import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import useUid from "@/utils/UidHook";

import * as modules from "@/services/modules";
import * as progress from "@/services/progress";
import * as repetition from "@/services/repetition";

import CoursePageLoading from "@/pages/Learning/components/LearningPageLoading";

import CaretRightEmpty from "@/components/icons/CaretRightEmpty";
import CaretRightFilled from "@/components/icons/CaretRightFilled";
import Tick from "@/components/icons/Tick";
import ModalPanel from "@/components/ModalPanel";

import type { Module, ProgressRecord } from "@/types";

type StatusesMap = Map<string, ProgressRecord>;

export default function CoursePage() {
  const { id = "" } = useParams();
  const [loading, setLoading] = useState<boolean | null>(null);
  const [course, setCourse] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Module[]>([]);
  const [statuses, setStatuses] = useState<StatusesMap | null>(null);
  const [currentProgress, setCurrentProgress] = useState<ProgressRecord | null>(
    null
  );
  const [wordsToRepeat, setWordsToRepeat] = useState(0);

  const [modal, showModal] = useState<boolean>(false);

  const uid = useUid();
  const navigate = useNavigate();
  const busy = useBusy();
  const alert = useAlert();
  const { t } = useTranslation();

  const fetchAndCheckEverything = useCallback(async () => {
    const fetchCourse = modules.fetchOne(id);
    const fetchLessons = modules.fetchChildren(id);
    const loadCurrentProcess = progress.find(uid(), id);
    const loadAgenda = repetition.agenda(uid());
    const [course, lessons, currentProgress, agenda] = await Promise.all([
      fetchCourse,
      fetchLessons,
      loadCurrentProcess,
      loadAgenda,
    ]);

    const responses = await Promise.all(
      lessons.map((e) => progress.find(uid(), e.id || ""))
    );
    const statusEntries = responses
      .filter(Boolean)
      .map((e) => [e?.moduleId || "", e]);
    // @ts-ignore
    const statuses = new Map<string, ProgressRecord>(statusEntries);
    setCourse(course);
    setLessons(lessons);
    setStatuses(statuses);
    setCurrentProgress(currentProgress);
    setWordsToRepeat(agenda.length);

  }, [id, uid]);

  
  useEffect(() => {
    setLoading(true);
    fetchAndCheckEverything()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchAndCheckEverything]);

  useEffect(() => {
    if (loading !== false) {
      return;
    }
    if (!course) {
      throw new Error("Your should choose course first")
    }

    if (!lessons) {
      throw new Error("This course have no lessons")
    }

    if (!currentProgress) {
      throw new Error("This course have no lessons")
    }
    if (!statuses?.size) {
      const firstLesson = lessons.at(0);
      progress
        .create({
          moduleId: firstLesson?.id || "",
          userId: uid(),
          startedAt: dayjs().valueOf(),
        })
        .then(() =>
          navigate(`/learning/course/${id}/lesson/${firstLesson?.id}`)
        )
        .catch(console.error);
      return;
    }

    if (
      lessons.every((e) => {
        const status = statuses.get(e?.id || "");
        return Boolean(status?.finishedAt);
      }) &&
      !currentProgress.finishedAt
    ) {
      progress.update({ ...currentProgress, finishedAt: dayjs().valueOf() });
      showModal(true);
    }
  }, [
    loading,
    alert,
    course,
    id,
    lessons,
    currentProgress,
    statuses,
    navigate,
    uid,
  ]);

  const checkStatus = (lesson: Module): "new" | "progress" | "finished" => {
    const status = statuses?.get(lesson?.id || "");
    if (status?.finishedAt) {
      return "finished";
    }
    if (status?.startedAt) {
      return "progress";
    }
    return "new";
  };

  const openLessonPage = (lessonId: string) => {
    navigate(`/learning/course/${id}/lesson/${lessonId}`);
  };

  const openRepetitionPage = () => {
    navigate("/learning/repetition");
  };

  const openRepetitionAddWordPage = () => {
    navigate('/learning/repetition/add');
  }

  const startLesson = (lesson: Module) => {
    if (!lesson || !lesson.id) {
      return;
    }
    const lessonId = lesson.id;
    const status = statuses?.get(lesson.id);
    if (!status) {
      busy(true);
      progress
        .create({
          moduleId: lesson.id,
          userId: uid(),
          startedAt: dayjs().valueOf(),
        })
        .then(() => {
          busy(false);
          openLessonPage(lessonId);
        })
        .catch(console.error);
    } else {
      openLessonPage(lessonId);
    }
  };

  const lessonToContinueFrom = lessons.find((e) =>
    ["progress", "new"].includes(checkStatus(e))
  );

  const canContinue = Boolean(lessonToContinueFrom);

  const continueLesson = () => {
    if (lessonToContinueFrom) {
      startLesson(lessonToContinueFrom);
    }
  };

  const exitCourse = () => {
    navigate("/learning/");
  };

  if (loading) {
    return <CoursePageLoading />;
  }

  const lessonItem = (lesson: Module) => {
    const status = checkStatus(lesson);
    if (status === "finished") {
      return (
        <div className="d-flex justify-content-between text-success">
          <span>
            <Tick />
            <span className="mx-1">{lesson.name}</span>
          </span>
          <span className="text-uppercase">
            [{t("CoursePage.status.done")}]
          </span>
        </div>
      );
    }
    if (status === "progress") {
      return (
        <div className="d-flex justify-content-between text-primary">
          <span>
            <CaretRightFilled />
            <span className="mx-1">{lesson.name}</span>
          </span>
          <span className="text-uppercase">
            [{t("CoursePage.status.progress")}]
          </span>
        </div>
      );
    }
    return (
      <div className="d-flex justify-content-between text-muted">
        <span>
          <CaretRightEmpty />
          <span className="mx-1">{lesson.name}</span>
        </span>
      </div>

    );
  };

  return (
    <div className="container-fluid">
      <h1>{course?.name}</h1>
      <div className="list-group">
        {lessons.map((lesson) => (
          <button
            type="button"
            className="list-group-item list-group-item-action"
            key={lesson.id}
            disabled={checkStatus(lesson) === "new"}
            onClick={() => startLesson(lesson)}
          >
            {lessonItem(lesson)}
          </button>
        ))}
      </div>

      <div className="row mt-3">
        <div className="col">
          {canContinue && (
            <button className="btn btn-primary w-100" onClick={continueLesson}>
              {t("CoursePage.buttons.continue")}
            </button>
          )}
          {!canContinue && (
            <button className="btn btn-success w-100" onClick={exitCourse}>
              {t("CoursePage.buttons.exit")}
            </button>
          )}
        </div>
        <div className="col">
          <button
            className="btn btn-outline-primary w-100"
            disabled={!wordsToRepeat}
            onClick={openRepetitionPage}
          >
            {t("CoursePage.buttons.repeat")}
            <span className="badge bg-primary rounded-pill ms-3">
              {wordsToRepeat}
            </span>
          </button>
        </div>
        <div className="col">
          <button className="btn btn-outline-primary w-100"
            onClick={openRepetitionAddWordPage}
          >
            {t("CoursePage.buttons.add_custom_activities")}
          </button>
        </div>
      </div>

      <ModalPanel show={modal} onClose={() => showModal(false)}>
        <h1>{t("CoursePage.modal.title")}</h1>
        <p>{t("CoursePage.modal.description", { course: course?.name })}</p>
        <button className="btn btn-primary w-100" onClick={exitCourse}>
          {t("CoursePage.modal.action")}
        </button>
      </ModalPanel>
    </div>
  );
}
