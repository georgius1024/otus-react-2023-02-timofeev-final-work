import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Outlet } from "react-router-dom";

import dayjs from "dayjs";

import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";

import * as modules from "@/services/modules";
import * as progress from "@/services/progress";

import ModalPanel from "@/components/ModalPanel";

import type { Module, ProgressRecord } from "@/types";
import type { RootState } from "@/store";

import LessonNavigation from "@/pages/Learning/components/LessonNavigation";
import "@/pages/Learning/LessonPage.scss";
import classNames from "classnames";

export default function LessonPage() {
  const { course, id = "", step = "" } = useParams();
  const [lesson, setLesson] = useState<Module | null>(null);
  const [activities, setActivities] = useState<Module[]>([]);
  const [currentActivity, setCurrentActivity] = useState<string>(step);
  const [modal, showModal] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<ProgressRecord | null>(
    null
  );
  const uid = useSelector((state: RootState) => state.auth?.user?.uid);

  const navigate = useNavigate();

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
    if (
      activities.length &&
      !activities.some((e) => e.id === currentActivity)
    ) {
      const first = activities.at(0);
      first?.id && navigateToStep(first.id);
    }
  }, [currentActivity, activities, navigateToStep]);

  useEffect(() => {
    if (!lesson?.id) {
      return;
    }
    progress.find(uid || "", lesson.id).then((response) => {
      if (!response) {
        navigate(`/learning/course/${course}`);
        alert("Your training was interrupted", "error");
      }
      setCurrentProgress(response);
    });
  }, [course, uid, lesson, navigate, alert]);

  const nextActivity = () => {
    const index = activities.findIndex((e) => e.id === currentActivity);
    const next = activities[index + 1]?.id;

    if (next) {
      navigateToStep(next);
    } else {
      if (!currentProgress) {
        return;
      }
      if (!currentProgress.finishedAt){
        const current = { ...currentProgress, finishedAt: dayjs().valueOf() };
        progress.update(current);
        setCurrentProgress(current);
        showModal(true);        
      } else {
        completeLesson()
      }
      
    }
  };

  const completeLesson = async () => {
    navigate(`/learning/course/${course}`);
  };

  if (!uid) {
    return (
      <div className="alert alert-danger" role="alert">
        Need to be logged in to start course
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="alert alert-danger" role="alert">
        Need to choose lesson first
      </div>
    );
  }

  if (!currentProgress) {
    return (
      <div className="alert alert-danger" role="alert">
        Need to start course and lesson first
      </div>
    );
  }
  if (!activities.length) {
    return <div>Loading...</div>;
  }

  const activity = activities.find((e) => e.id === currentActivity)?.activity;
  const position = activities.findIndex((e) => e.id === currentActivity);
  const lessonIsCompleted = Boolean(currentProgress.finishedAt);
  return (
    <div className="container-fluid">
      {lessonIsCompleted && <h1>Repeating {lesson.name}</h1> }
      {!lessonIsCompleted && <h1>{lesson.name} in progress</h1> }
      <div className={classNames("progress", "my-2", { "d-none": lessonIsCompleted })} style={{height: '4px'}}>
        <div
          className="progress-bar"
          style={{ width: `${((position + 1) * 100 - 1) / activities.length}%` }}
        ></div>
      </div>
      <div className={classNames("row", "my-2", { "d-none": !lessonIsCompleted })}>
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
            Exit lesson
          </button>
        </div>
      </div>
      <Outlet context={{ activity: activity, onDone: nextActivity }} />
      <ModalPanel show={modal} onClose={() => showModal(false)}>
        <h1>Congrats!</h1>
        <p>Click button to complete lesson</p>
        <button
          className="btn btn-primary w-100"
          onClick={() => completeLesson()}
        >
          Complete lesson
        </button>
      </ModalPanel>
    </div>
  );
}
