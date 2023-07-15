import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Outlet } from "react-router";
import { useSelector } from "react-redux";

import useAlert from "@/utils/AlertHook";

import * as modules from "@/services/modules";
import * as repetition from "@/services/repetition";

import type { RepetitionRecord } from "@/types";
import type { RootState } from "@/store";
import type { RepetitionStep } from "@/pages/Learning/components/ActivityTypes";

export default function RepetitionPage() {
  const uid = useSelector((state: RootState) => state.auth?.auth?.uid);
  const { step = "" } = useParams();

  const [loading, setLoading] = useState<boolean | null>(null);
  const [steps, setSteps] = useState<RepetitionStep[]>([]);
  const [currentStep, setStep] = useState<string>(step);

  const alert = useAlert();
  const navigate = useNavigate();

  const openLearningPage = useCallback(() => {
    navigate("/learning/");
  }, [navigate]);

  const navigateToStep = useCallback(
    (step?: string) => {
      if (!step) {
        return;
      }
      setStep(step);
      navigate(`/learning/repetition/${step}`);
    },
    [navigate]
  );

  const fetchAll = useCallback(async () => {
    const agenda = await repetition.agenda(uid || "");
    const promises = agenda.map((rep: RepetitionRecord) => {
      return modules.fetchOne(rep.activityId);
    });
    const activities = await Promise.all(promises);

    const steps = ["learn", "translate-direct", "translate-reverse", "puzzle"].map(
      (type) => {
          return activities.map((activity) => {
          const repetition = agenda.find((r) => r.activityId == activity?.id);
          return {
            id : `${type}-${activity?.id}`,
            type,
            repetition,
            activity,
          } as RepetitionStep;
        })
      })
      .flat(1);
    setSteps(steps);
  }, [uid]);

  useEffect(() => {
    setLoading(true);
    fetchAll()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchAll]);

  useEffect(() => {
    if (loading !== false) {
      return;
    }
    if (!steps) {
      openLearningPage();
      alert("No words to repeat today", "warning");
    }

    const firstStep = steps.at(0)?.id;

    if (!step && firstStep) {
      navigateToStep(firstStep);
      setStep(firstStep);
    }
  }, [
    loading,
    steps,
    step,
    navigate,
    alert,
    openLearningPage,
    navigateToStep,
  ]);

  const nextStep = () => {
    const position = steps.findIndex(e => e.id === currentStep)
    if (position === steps.length - 1) {
      alert("Done");
      openLearningPage();
    } else {
      navigateToStep(steps[position+1].id)
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const current = steps.find((e) => e.id === currentStep);

  return (
    <div className="container-fluid">
      <h1>Hello repetition</h1>
      <div>{steps.findIndex((e) => e.id === currentStep)} / {steps.length}</div>
      <Outlet context={{ step: current, onDone: nextStep }} />
      <hr />
      <button
        className="btn btn-secondary light-text"
        onClick={openLearningPage}
      >
        Back
      </button>
    </div>
  );
}
