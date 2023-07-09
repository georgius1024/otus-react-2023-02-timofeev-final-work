import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Outlet } from "react-router-dom";

import dayjs from "dayjs";

import useBusy from "@/utils/BusyHook";

import * as modules from "@/services/modules";
import * as progress from "@/services/progress";

import ModalPanel from "@/components/ModalPanel";

import type { Module, ProgressRecord } from "@/types";
import type { RootState } from "@/store";

import LessonNavigation from "@/pages/Learning/components/LessonNavigation";
import "@/pages/Learning/LessonPage.scss";

export default function LessonPage() {
  const { course, id = "", step = "" } = useParams();
  const [lesson, setLesson] = useState<Module | null>(null);
  const [activities, setActivities] = useState<Module[]>([]);
  const [position, setPosition] = useState<string>(step);
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
      setPosition(step);
      navigate(`/learning/course/${course}/lesson/${id}/step/${step}`);
    },
    [course, id, navigate]
  );

  const busy = useBusy();

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
    if (activities.length && !activities.some((e) => e.id === position)) {
      const first = activities.at(0);
      first?.id && navigateToStep(first.id);
    }
  }, [position, activities, navigateToStep]);

  useEffect(() => {
    if (!lesson?.id) {
      return;
    }
    progress.find(uid || "", lesson.id).then((response) => {
      if (!response) {
        navigate(`/learning/course/${course}`);
        // TODO Add alert
      }
      setCurrentProgress(response);
    });
  }, [course, uid, lesson, navigate]);

  const nextActivity = () => {
    const index = activities.findIndex((e) => e.id === position);
    const next = activities[index + 1]?.id;

    if (next) {
      navigateToStep(next);
    } else {
      showModal(true);
    }
  };

  const completeLesson = async () => {
    if (!currentProgress) {
      return;
    }
    progress.update({ ...currentProgress, finishedAt: dayjs().valueOf() });

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
  const activity = activities.find((e) => e.id === position)?.activity;

  return (
    <div className="container-fluid">
      <h1>Lesson {lesson.name} in progress</h1>
      <LessonNavigation
        count={activities.length}
        position={activities.findIndex((e) => e.id === position)}
        onNavigate={(position) => navigateToStep(activities[position]?.id)}
      />
      <Outlet context={{ activity: activity, onDone: nextActivity }} />
      <ModalPanel
        show={modal}
        closeControl={false}
        clickClose={false}
        onClose={() => showModal(false)}
      >
        <h1>You're finished lesson</h1>
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
