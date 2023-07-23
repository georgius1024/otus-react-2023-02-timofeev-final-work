import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Outlet } from "react-router";
import { useTranslation } from "react-i18next";

import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import useUid from "@/utils/UidHook";
import useError from "@/utils/ErrorHook";

import * as modules from "@/services/modules";
import * as repetition from "@/services/repetition";

import RepetitionPageLoading from "./components/RepetitionPageLoading";

import type { RepetitionRecord } from "@/types";

import type { RepetitionStep } from "@/pages/Learning/components/ActivityTypes";

export default function RepetitionPage() {
  const { step = "" } = useParams();

  const [loading, setLoading] = useState<boolean | null>(null);
  const [steps, setSteps] = useState<RepetitionStep[]>([]);
  const [currentStep, setStep] = useState<string>(step);
  const [failed, setFailed] = useState<Set<string>>(new Set());

  const alert = useAlert();
  const busy = useBusy();
  const uid = useUid();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const errorHandler = useError();

  const current = steps.find((e) => e.id === currentStep);
  const currentIndex = steps.findIndex((e) => e.id === currentStep);

  const openHomePage = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const updateRepetitionStatus = useCallback(
    (uid: string, steps: RepetitionStep[], failed: Set<string>) => {
      const modulesSet = new Set<string>(steps.map((step) => step.moduleId));
      const moduleIds = [...modulesSet.values()];
      const promises = moduleIds.map((moduleId) => {
        if (failed.has(moduleId)) {
          return repetition.reset(uid, moduleId);
        } else {
          return repetition.repeat(uid, moduleId);
        }
      });
      return Promise.all(promises);
    },
    []
  );

  const nextStep = async () => {
    if (currentIndex === steps.length - 1) {
      busy(true);
      await updateRepetitionStatus(uid(), steps, failed)
        .then(() => {
          alert(t("RepetitionPage.confirm"), "success");
          openHomePage();
        })
        .finally(() => busy(false));
    } else {
      const nextStep = steps[currentIndex + 1];
      navigateToStep(nextStep.id);
    }
  };
  const onFail = () => {
    if (current) {
      setFailed(failed.add(current.moduleId));
    }
  };

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
    const [agenda] = await Promise.all([
      repetition.agenda(uid()),
      modules.findWords("word"),
      modules.findWords("phrase"),
      modules.findTranslations("word"),
      modules.findTranslations("phrase"),
    ]);
    const promises = agenda.map((rep: RepetitionRecord) => {
      return modules.fetchOne(rep.moduleId);
    });
    const portion = await Promise.all(promises);

    const steps = ["learn", "translate-direct", "translate-reverse", "puzzle"]
      .map((type) => {
        return portion.map((module) => {
          const repetition = agenda.find((r) => r.moduleId == module?.id);
          return {
            id: `${type}-${module?.id}`,
            moduleId: module?.id,
            type,
            repetition,
            activity: module?.activity,
          } as RepetitionStep;
        });
      })
      .flat(1);
    setSteps(steps);
  }, [uid]);

  useEffect(() => {
    setLoading(true);
    fetchAll()
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, [fetchAll, errorHandler]);

  useEffect(() => {
    if (loading !== false) {
      return;
    }
    if (!steps) {
      throw new Error("No words to repeat today");
    }

    const firstStep = steps.at(0)?.id;

    if (!step && firstStep) {
      navigateToStep(firstStep);
      setStep(firstStep);
    }
  }, [loading, steps, step, navigate, alert, navigateToStep]);

  if (loading) {
    return <RepetitionPageLoading />;
  }

  return (
    <div className="container-fluid mt-4">
      <h1>{t("RepetitionPage.title")}</h1>
      <div className="progress my-3" style={{ height: "12px" }}>
        <div
          className="progress-bar"
          style={{
            width: `${((currentIndex + 0.5) * 100) / steps.length}%`,
          }}
        ></div>
      </div>
      <Outlet context={{ step: current, onDone: nextStep, onFail }} />
    </div>
  );
}
