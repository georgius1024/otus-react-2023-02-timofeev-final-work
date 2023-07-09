import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";
import * as progress from "@/services/progress";
import ModalPanel from "@/components/ModalPanel";
import CaretRightEmpty from "@/components/icons/CaretRightEmpty";
import CaretRightFilled from "@/components/icons/CaretRightFilled";
import Tick from "@/components/icons/Tick";

import type { RootState } from "@/store";
import type { Module, ProgressRecord } from "@/types";

type StatusesMap = Map<string, ProgressRecord>;

export default function LearningIndex() {
  const [courses, setCourses] = useState<Module[]>([]);
  const [confirm, setConfirm] = useState<Module | null>(null);
  const [statuses, setStatuses] = useState<StatusesMap>(
    new Map<string, ProgressRecord>()
  );
  const uid = useSelector((state: RootState) => state.auth?.user?.uid);

  const navigate = useNavigate();
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

  useEffect(() => {
    if (!courses.length) {
      return;
    }
    const promises = courses.map((e) => progress.find(uid || "", e.id || ""));
    Promise.all(promises).then((responses) => {
      const entries = responses
        .filter(Boolean)
        .map((e) => [e?.moduleId || "", e]);
      // @ts-ignore
      setStatuses(new Map<string, ProgressRecord>(entries));
    });
  }, [courses, uid]);

  const openCoursePage = (id: string) => {
    navigate(`/learning/course/${id}`);
  };

  const startCourse = async (course: Module | null) => {
    if (!course || !course.id) {
      return;
    }
    const status = statuses.get(course.id);
    busy(true);
    if (status?.finishedAt) {
      await progress.update({
        ...status,
        startedAt: dayjs().valueOf(),
        finishedAt: null
      });
      // TODO - discard all lessons&activities progress
    }
    if (!status) {
      await progress.create({
        moduleId: course?.id || "",
        userId: uid || "",
        startedAt: dayjs().valueOf(),
      });
    }
    busy(false);
    openCoursePage(course.id);
  };

  const checkStatus = (course: Module): 'new' | 'progress' | 'finished' => {
    const status = statuses.get(course?.id || "");
    if (status?.finishedAt) {
      return 'finished'
    }
    if (status?.startedAt) {
      return 'progress'
    }
    return 'new'
  }


  const resolveCourseAction = (course: Module) => {
    if (!course || !course.id) {
      return;
    }
    const status = checkStatus(course);
    if (status === 'new') {
      setConfirm(course);
    } else {
      openCoursePage(course.id);
    }
  };



  const courseItem = (course: Module) => {
    const status = checkStatus(course);
    if (status === 'finished') {
      return (
        <span className="text-success">
          <Tick />
          <span className="mx-1">{course.name}</span>
          [DONE]
        </span>
      );
    }
    if (status === 'progress') {
      return (
        <span className="text-primary">
          <CaretRightFilled />
          <span className="mx-1">{course.name}</span>
          [IN PROGRESS]
        </span>
      );
    }
    return (
      <span className="text-dark">
        <CaretRightEmpty />
        <span className="mx-1">{course.name}</span>
      </span>
    );
    
  };

  const incompleted = [...statuses.values()].find(e => e.startedAt && !e.finishedAt) 
  const canContinue = Boolean(incompleted)
  const continueCourse = () => {
    const course = courses.find(e => e.id === incompleted?.moduleId)
    if (course) {
      resolveCourseAction(course)
    }
  }

  if (!uid) {
    return (
      <div className="alert alert-danger" role="alert">
        Need to be logged in to start course!!!
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h1>Choose course</h1>
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
          <button className="btn btn-primary w-100" disabled={!canContinue} onClick={continueCourse}>Continue training</button>
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

      <ModalPanel show={Boolean(confirm)} onClose={() => setConfirm(null)}>
        <h1>Start course confirmation</h1>
        <p>You are going to start course "{confirm?.name}"?</p>
        <button
          className="btn btn-primary w-100"
          onClick={() => startCourse(confirm)}
        >
          Start course
        </button>
      </ModalPanel>
    </div>
  );
}
