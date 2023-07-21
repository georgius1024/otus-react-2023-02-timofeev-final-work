import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import classNames from "classnames";

import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import useUid from "@/utils/UidHook";

import * as modules from "@/services/modules";
import * as progress from "@/services/progress";
import * as repetition from "@/services/repetition";

import ModalPanel from "@/components/ModalPanel";
import Placeholder from "@/components/Placeholder";

import type { Module, ProgressRecord } from "@/types";
import type {
  LessonStep,
  StepType,
} from "@/pages/Learning/components/ActivityTypes";

import LessonNavigation from "@/pages/Learning/components/LessonNavigation";
import "@/pages/Learning/LessonPage.scss";

export default function LessonPage() {
  const { courseId = "", lessonId = "", stepId = "" } = useParams();
  const [loading, setLoading] = useState<boolean | null>(null);
  const [course, setCourse] = useState<Module | null>(null);
  const [lesson, setLesson] = useState<Module | null>(null);
  // const [activities, setActivities] = useState<Module[]>([]);
  //const [currentActivity, setCurrentActivity] = useState<string>(step);

  const [steps, setSteps] = useState<LessonStep[]>([]);
  const [currentStep, setStep] = useState<string>(stepId);
  const [modal, showModal] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<ProgressRecord | null>(
    null
  );

  const uid = useUid();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const busy = useBusy();
  const alert = useAlert();

  const current = steps.find((e) => e.id === currentStep);
  const currentIndex = steps.findIndex((e) => e.id === currentStep);
  const lessonIsCompleted = Boolean(currentProgress?.finishedAt);

  const navigateToStep = useCallback(
    (stepId: string) => {
      setStep(stepId);
      navigate(
        `/learning/course/${courseId}/lesson/${lessonId}/step/${stepId}`
      );
    },
    [navigate, courseId, lessonId]
  );

  const nextStep = () => {
    if (!currentProgress) {
      return;
    }
    if (!currentProgress.finishedAt && current) {
      if (["word", "phrase"].includes(current.activity.type)) {
        repetition.start(uid(), current.moduleId);
      }
    }
    if (currentIndex === steps.length - 1) {
      if (!currentProgress.finishedAt) {
        const updated = { ...currentProgress, finishedAt: dayjs().valueOf() };
        progress.update(updated);
        setCurrentProgress(updated);
        showModal(true);
      } else {
        completeLesson();
      }
    } else {
      const nextStep = steps[currentIndex + 1];
      navigateToStep(nextStep.id);
    }
  };

  const fetchEverything = useCallback(async () => {
    const fetchCourse = modules.fetchOne(courseId);
    const fetchLesson = modules.fetchOne(lessonId);
    const fetchActivities = modules.fetchChildren(lessonId);
    const fetchCurrentProgress = await progress.find(uid(), lessonId);

    const [course, lesson, activities, currentProgress] = await Promise.all([
      fetchCourse,
      fetchLesson,
      fetchActivities,
      fetchCurrentProgress,
    ]);

    const steps = activities
      .map((module) => {
        if (!module.activity) {
          return;
        }
        const availableSteps: StepType[] =
          module.activity.type === "slide"
            ? ["learn"]
            : ["learn", "translate-direct", "translate-reverse", "puzzle"];
        return availableSteps.map((type) => {
          return {
            id: `${type}-${module?.id}`,
            moduleId: module?.id,
            type,
            activity: module?.activity,
          } as LessonStep;
        });
      })
      .flat()
      .filter(Boolean) as LessonStep[];

    setCourse(course);
    setLesson(lesson);
    setCurrentProgress(currentProgress);
    setSteps(steps);
  }, [uid, lessonId, courseId]);

  useEffect(() => {
    setLoading(true);
    fetchEverything()
      .finally(() => setLoading(false));
  }, [busy, fetchEverything]);

  useEffect(() => {
    if (loading !== false) {
      return;
    }

    if (!course) {
      navigate(`/learning/courses`);
      alert("Your should choose course first", "error");
      return;
    }

    if (!lesson) {
      navigate(`/learning/course/${courseId}`);
      alert("Your should choose lesson first", "error");
      return;
    }

    if (!currentProgress) {
      navigate(`/learning/course/${courseId}`);
      alert("Your training was interrupted", "error");
    }

    if (!steps) {
      navigate(`/learning/course/${courseId}`);
      alert("Empty lesson without activities", "error");
      return;
    }

    const firstStep = steps.at(0)?.id;

    if (!stepId && firstStep) {
      navigateToStep(firstStep);
      setStep(firstStep);
    }
  }, [
    loading,
    course,
    lesson,
    currentProgress,
    courseId,
    lessonId,
    stepId,
    steps,
    navigate,
    alert,
    navigateToStep,
  ]);

  const completeLesson = async () => {
    navigate(`/learning/course/${courseId}`);
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

  return (
    <div className="container-fluid mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item " aria-current="page">
            {course?.name}
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
            width: `${((currentIndex + 0.5) * 100) / steps.length}%`,
          }}
        ></div>
      </div>
      <div
        className={classNames("row", "my-2", { "d-none": !lessonIsCompleted })}
      >
        <div className="col">
          <LessonNavigation
            count={steps.length}
            position={currentIndex}
            onNavigate={(position) => navigateToStep(steps[position]?.id)}
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
      <Outlet context={{ step: current, onDone: nextStep }} />
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
