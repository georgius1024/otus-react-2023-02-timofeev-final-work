import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";

import useBusy from "@/utils/BusyHook";
import useUid from "@/utils/UidHook";

import * as modules from "@/services/modules";
import * as progress from "@/services/progress";
import * as repetition from "@/services/repetition";

import CaretRightEmpty from "@/components/icons/CaretRightEmpty";
import CaretRightFilled from "@/components/icons/CaretRightFilled";
import Tick from "@/components/icons/Tick";
import ModalPanel from "@/components/ModalPanel";
import LearningPageLoading from "@/pages/Learning/components/LearningPageLoading";

import type { Module, ProgressRecord } from "@/types";

type StatusesMap = Map<string, ProgressRecord>;

export default function LearningIndex() {
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<Module[]>([]);
  const [confirm, setConfirm] = useState<Module | null>(null);
  const [statuses, setStatuses] = useState<StatusesMap>(
    new Map<string, ProgressRecord>()
  );
  const [wordsToRepeat, setWordsToRepeat] = useState(0);

  const uid = useUid();
  const navigate = useNavigate();
  const busy = useBusy();
  const { t } = useTranslation();

  const fetchAll = useCallback(async () => {
    const loadCoursesPromise = modules.fetchChildren("");
    const loadAgenda = repetition.agenda(uid());
    const [courses, agenda] = await Promise.all([
      loadCoursesPromise,
      loadAgenda,
    ]);
    const promises = courses.map((e) => progress.find(uid(), e.id || ""));
    const responses = await Promise.all(promises);
    const entries = responses
      .filter(Boolean)
      .map((e) => [e?.moduleId || "", e]);
    // @ts-ignore
    setStatuses(new Map<string, ProgressRecord>(entries));
    setCourses(courses.filter(e => e.enabled));
    setWordsToRepeat(agenda.length);
  }, [uid]);

  useEffect(() => {
    setLoading(true);
    fetchAll()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchAll]);

  const openCoursePage = (id: string) => {
    navigate(`/learning/course/${id}`);
  };

  const openRepetitionPage = () => {
    navigate("/learning/repetition");
  };

  const openRepetitionAddWordPage = () => {
    navigate("/learning/repetition/add");
  };

  const startCourse = async (course: Module | null) => {
    if (!course || !course.id || !uid()) {
      return;
    }
    const status = statuses.get(course.id);
    if (!status) {
      busy(true);
      await progress
        .create({
          moduleId: course.id,
          userId: uid(),
          startedAt: dayjs().valueOf(),
        })
        .catch(console.error);
      busy(false);
    }
    openCoursePage(course.id);
  };

  const checkStatus = (course: Module): "new" | "progress" | "finished" => {
    const status = statuses.get(course?.id || "");
    if (status?.finishedAt) {
      return "finished";
    }
    if (status?.startedAt) {
      return "progress";
    }
    return "new";
  };

  const resolveCourseAction = (course: Module) => {
    if (!course || !course.id) {
      return;
    }
    const status = checkStatus(course);
    if (status === "new") {
      setConfirm(course);
    } else {
      openCoursePage(course.id);
    }
  };

  const courseItem = (course: Module) => {
    const status = checkStatus(course);
    if (status === "finished") {
      return (
        <div className="d-flex justify-content-between text-success">
          <span>
            <Tick />
            <span className="mx-1">{course.name}</span>
          </span>
          <span className="text-uppercase">
            [{t("LearningPage.status.done")}]
          </span>
        </div>
      );
    }
    if (status === "progress") {
      return (
        <div className="d-flex justify-content-between text-primary">
          <span>
            <CaretRightFilled />
            <span className="mx-1">{course.name}</span>
          </span>
          <span className="text-uppercase">
            [{t("LearningPage.status.progress")}]
          </span>
        </div>
      );
    }
    return (
      <div className="d-flex justify-content-between">
        <span className="text-dark">
          <CaretRightEmpty />
          <span className="mx-1">{course.name}</span>
        </span>
      </div>
    );
  };

  const incompleted = [...statuses.values()].find(
    (e) => e.startedAt && !e.finishedAt
  );
  const canContinue = Boolean(incompleted);
  const continueCourse = () => {
    const course = courses.find((e) => e.id === incompleted?.moduleId);
    if (course) {
      resolveCourseAction(course);
    }
  };
  if (loading) {
    return <LearningPageLoading />;
  }

  if (!uid()) {
    return (
      <div className="alert alert-danger" role="alert">
        Need to be logged in to start course!!!
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <h1>{t("LearningPage.title")}</h1>
      <div className="list-group">
        {courses.map((course) => (
          <button
            type="button"
            className="list-group-item list-group-item-action"
            key={course.id}
            onClick={() => resolveCourseAction(course)}
          >
            {courseItem(course)}
          </button>
        ))}
      </div>

      <div className="row mt-3">
        <div className="col">
          <button
            className="btn btn-primary w-100"
            disabled={!canContinue}
            onClick={continueCourse}
          >
            {t("LearningPage.buttons.continue")}
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-outline-primary w-100"
            disabled={!wordsToRepeat}
            onClick={openRepetitionPage}
          >
            {t("LearningPage.buttons.repeat")}

            <span className="badge bg-primary rounded-pill ms-3">
              {wordsToRepeat}
            </span>
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-outline-primary w-100"
            onClick={openRepetitionAddWordPage}
          >
            {t("LearningPage.buttons.add_custom_activities")}
          </button>
        </div>
      </div>

      <ModalPanel show={Boolean(confirm)} onClose={() => setConfirm(null)}>
        <h1>{t("LearningPage.modal.title")}</h1>
        <p>{t("LearningPage.modal.description", { course: confirm?.name })}</p>
        <button
          className="btn btn-primary w-100"
          onClick={() => startCourse(confirm)}
        >
          {t("LearningPage.modal.action")}
        </button>
      </ModalPanel>
    </div>
  );
}
