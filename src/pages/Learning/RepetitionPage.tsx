import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Outlet } from "react-router";
import { useSelector } from "react-redux";

import useAlert from "@/utils/AlertHook";

import * as modules from "@/services/modules";
import * as repetition from "@/services/repetition";

import type { Module, RepetitionRecord } from "@/types";
import type { RootState } from "@/store";


export default function RepetitionPage() {
  const uid = useSelector((state: RootState) => state.auth?.user?.uid);
  const { activity = "" } = useParams();

  const [loading, setLoading] = useState<boolean | null>(null);
  const [activities, setActivities] = useState<Module[]>([]);
  const [agenda, setAgenda] = useState<RepetitionRecord[]>([]);
  const [currentActivity, setCurrentActivity] = useState<string>(activity);

  const alert = useAlert()
  const navigate = useNavigate();

  const openLearningPage = useCallback(() => {
    navigate("/learning/");
  }, [navigate]);

  const navigateToActivity = useCallback(
    (activity?: string) => {
      if (!activity) {
        return;
      }
      setCurrentActivity(activity);
      navigate(`/learning/repetition/${activity}`);
    },
    [navigate]
  );

  const fetchAll = useCallback(async () => {
    const agenda = await repetition.agenda(uid || '')
    const promises = agenda.map((rep: RepetitionRecord) => {
      return modules.fetchOne(rep.activityId)
    })
    const activities = await Promise.all(promises)

    setAgenda(agenda)
    setActivities(activities.filter(Boolean) as Module[])
  }, [uid])

  useEffect(() => {
    setLoading(true)
    fetchAll().catch(console.error).finally(() => setLoading(false))
  }, [fetchAll])

  useEffect(() => {
    if (loading !== false) {
      return 
    }
    if (!agenda) {
      openLearningPage()
      alert('No words to repeat today', 'warning')
    }

    const firstActivity = agenda.at(0)?.activityId

    if (!currentActivity && firstActivity) {
      navigateToActivity(firstActivity)
      setCurrentActivity(firstActivity)
    }

  }, [loading, agenda, currentActivity, navigate, alert, openLearningPage, navigateToActivity])

  const nextActivity = () => {

    repetition.register(uid || '', currentActivity);

    const index = activities.findIndex((e) => e.id === currentActivity);
    const nextActivityId = activities[index + 1]?.id;
    if (nextActivityId) {
      setCurrentActivity(nextActivityId)
    } else {
      alert('Done')
      openLearningPage()
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  const current = activities.find((e) => e.id === currentActivity)?.activity;

  return (
    <div className="container-fluid">
      <h1>Hello repetition</h1>
      <Outlet context={{ activity: current, onDone: nextActivity }} />
      <hr/>
      <button className="btn btn-secondary light-text" onClick={openLearningPage}>
          Back
      </button>
    </div>
  );
}
