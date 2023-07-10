import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import dayjs from "dayjs";

import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";
import * as progress from "@/services/progress";

import CaretRightEmpty from "@/components/icons/CaretRightEmpty";
import CaretRightFilled from "@/components/icons/CaretRightFilled";
import Tick from "@/components/icons/Tick";
import ModalPanel from "@/components/ModalPanel";

import type { Module, ProgressRecord } from "@/types";
import type { RootState } from "@/store";

type StatusesMap = Map<string, ProgressRecord>;

export default function CoursePage() {
  const { id = "" } = useParams();
  const [course, setCourse] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Module[]>([]);
  const [statuses, setStatuses] = useState<StatusesMap | null>(null);
  const [modal, showModal] = useState<boolean>(false);

  const uid = useSelector((state: RootState) => state.auth?.user?.uid);

  const navigate = useNavigate();

  const busy = useBusy();
  const alert = useAlert();

  const fetchEverything = useCallback(async () => {
    const fetchCourse = modules.fetchOne(id);
    const fetchLessons = modules.fetchChildren(id);

    const [course, lessons] = await Promise.all([fetchCourse, fetchLessons]);

    const responses = await Promise.all(
      lessons.map((e) => progress.find(uid || "", e.id || ""))
    );
    const statusEntries = responses
      .filter(Boolean)
      .map((e) => [e?.moduleId || "", e]);
    // @ts-ignore
    const statuses = new Map<string, ProgressRecord>(statusEntries);
    const currentProgress = await progress.find(uid || "", course?.id || "");

    if (!course) {
      navigate(`/learning/courses`);
      alert("Your should choose course first", "error");
      return;
    }

    if (!lessons) {
      navigate(`/learning/courses`);
      alert("This course have no lessons", "error");
      return;
    }

    if (!currentProgress) {
      navigate(`/learning/courses`);
      alert("Your training was interrupted", "error");
      return;
    }

    if (!statuses.size) {
      const firstLesson = lessons.at(0);
      progress
        .create({
          moduleId: firstLesson?.id || "",
          userId: uid || "",
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

    setCourse(course);
    setLessons(lessons);
    setStatuses(statuses);
  }, [alert, id, uid, navigate]);

  useEffect(() => {
    busy(true);
    fetchEverything()
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy, fetchEverything]);

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
          userId: uid || "",
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

  if (!lessons.length) {
    return "Loading...";
  }

  const lessonItem = (lesson: Module) => {
    const status = checkStatus(lesson);
    if (status === "finished") {
      return (
        <span className="text-success">
          <Tick />
          <span className="mx-1">{lesson.name}</span>
          [DONE]
        </span>
      );
    }
    if (status === "progress") {
      return (
        <span className="text-primary">
          <CaretRightFilled />
          <span className="mx-1">{lesson.name}</span>
          [IN PROGRESS]
        </span>
      );
    }
    return (
      <span className="text-muted">
        <CaretRightEmpty />
        <span className="mx-1">{lesson.name}</span>
      </span>
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
              Continue course
            </button>
          )}
          {!canContinue && (
            <button className="btn btn-success w-100" onClick={exitCourse}>
              Exit course
            </button>
          )}
        </div>
        <div className="col">
          <button className="btn btn-outline-primary w-100">
            Repeat words
            <span className="badge bg-primary rounded-pill ms-3">12</span>
          </button>
        </div>
        <div className="col">
          <button className="btn btn-outline-primary w-100">
            Add words to learn
          </button>
        </div>
      </div>

      <ModalPanel show={modal} onClose={() => showModal(false)}>
        <h1>Congratulations</h1>
        <p>You're completed the course. Click button to exit</p>
        <button className="btn btn-primary w-100" onClick={exitCourse}>
          Exit course
        </button>
      </ModalPanel>
    </div>
  );
}
