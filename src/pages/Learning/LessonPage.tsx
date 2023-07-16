import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";

import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import useUid from "@/utils/UidHook";

import * as modules from "@/services/modules";
import * as progress from "@/services/progress";
import * as repetition from "@/services/repetition";

import ModalPanel from "@/components/ModalPanel";
import Placeholder from "@/components/Placeholder";

import type { Module, ProgressRecord } from "@/types";

import LessonNavigation from "@/pages/Learning/components/LessonNavigation";
import "@/pages/Learning/LessonPage.scss";
import classNames from "classnames";

export default function LessonPage() {
  const { course = "", id = "", step = "" } = useParams();
  const [loading, setLoading] = useState<boolean | null>(null);
  const [parent, setParent] = useState<Module | null>(null);
  const [lesson, setLesson] = useState<Module | null>(null);
  const [activities, setActivities] = useState<Module[]>([]);
  const [currentActivity, setCurrentActivity] = useState<string>(step);
  const [modal, showModal] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<ProgressRecord | null>(
    null
  );

  const uid = useUid();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateToStep = useCallback(
    (step?: string) => {
      if (!step) {
        return;
      }
      setCurrentActivity(step);
      navigate(`/learning/course/${course}/lesson/${id}/step/${step}`);
    },
    [course, id, navigate]
  );

  const busy = useBusy();
  const alert = useAlert();

  const fetchEverything = useCallback(async () => {
    const fetchParent = modules.fetchOne(course);
    const fetchLesson = modules.fetchOne(id);
    const fetchActivities = modules.fetchChildren(id);
    const fetchCurrentProgress = await progress.find(uid(), id);

    const [parent, lesson, activities, currentProgress] = await Promise.all([
      fetchParent,
      fetchLesson,
      fetchActivities,
      fetchCurrentProgress,
    ]);

    if (!parent) {
      navigate(`/learning/courses`);
      alert("Your should choose course first", "error");
      return;
    }

    if (!lesson) {
      navigate(`/learning/course/${course}`);
      alert("Your should choose lesson first", "error");
      return;
    }

    if (!currentProgress) {
      navigate(`/learning/course/${course}`);
      alert("Your training was interrupted", "error");
    }

    const currentActivity = activities.find((e) => e.id === step);

    if (!currentActivity) {
      const firstActivityId = activities.at(0)?.id || "";
      navigate(
        `/learning/course/${course}/lesson/${id}/step/${firstActivityId}`
      );
      setCurrentActivity(firstActivityId);
    }

    setParent(parent);
    setLesson(lesson);
    setActivities(activities);
    setCurrentProgress(currentProgress);
  }, [uid, id, course, step, navigate, alert]);

  useEffect(() => {
    setLoading(true);
    fetchEverything()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [busy, fetchEverything]);

  const nextActivity = () => {
    if (!currentProgress?.finishedAt) {
      if (
        ["word", "phrase"].includes(
          activities.find((e) => e.id === currentActivity)?.activity?.type || ""
        )
      ) {
        repetition.start(uid(), currentActivity);
      }
    }

    const index = activities.findIndex((e) => e.id === currentActivity);
    const next = activities[index + 1]?.id;
    if (!currentProgress) {
      return;
    }

    if (next) {
      navigateToStep(next);
    } else {
      if (!currentProgress.finishedAt) {
        const current = { ...currentProgress, finishedAt: dayjs().valueOf() };
        progress.update(current);
        setCurrentProgress(current);
        showModal(true);
      } else {
        completeLesson();
      }
    }
  };

  const completeLesson = async () => {
    navigate(`/learning/course/${course}`);
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="row mt-3">
          <div className="col">
            <Placeholder height="24px" rounded />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <Placeholder height="24px" rounded />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <Placeholder height="24px" rounded />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <Placeholder height="24px" rounded />
          </div>
        </div>
      </div>
    );
  }

  const activity = activities.find((e) => e.id === currentActivity)?.activity;
  const position = activities.findIndex((e) => e.id === currentActivity);
  const lessonIsCompleted = Boolean(currentProgress?.finishedAt);
  return (
    <div className="container-fluid mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item " aria-current="page">
            {parent?.name}
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {lesson?.name}
          </li>
        </ol>
      </nav>
      <h1>{lesson?.name}</h1>
      <div
        className={classNames("progress", "my-2", {
          "d-none": lessonIsCompleted,
        })}
        style={{ height: "4px" }}
      >
        <div
          className="progress-bar"
          style={{
            width: `${((position + 0.5) * 100) / activities.length}%`,
          }}
        ></div>
      </div>
      <div
        className={classNames("row", "my-2", { "d-none": !lessonIsCompleted })}
      >
        <div className="col">
          <LessonNavigation
            count={activities.length}
            position={position}
            onNavigate={(position) => navigateToStep(activities[position]?.id)}
          />
        </div>
        <div className="col text-end">
          <button
            className="btn btn-outline-success btn-sm"
            onClick={completeLesson}
          >
            {t("LessonPage.buttons.exit")}
          </button>
        </div>
      </div>
      <Outlet context={{ activity: activity, onDone: nextActivity }} />
      <ModalPanel show={modal} onClose={() => showModal(false)}>
      <h1>{t("LessonPage.modal.title")}</h1>
        <p>{t("LessonPage.modal.description", { lesson: lesson?.name })}</p>
        <button className="btn btn-primary w-100" onClick={completeLesson}>
          {t("LessonPage.modal.action")}
        </button>
      </ModalPanel>
    </div>
  );
}
