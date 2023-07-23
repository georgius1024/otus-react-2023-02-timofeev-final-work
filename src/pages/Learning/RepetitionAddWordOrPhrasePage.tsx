import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import classNames from "classnames";
import dayjs from "dayjs";

import * as modules from "@/services/modules";
import * as repetition from "@/services/repetition";

import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import useUid from "@/utils/UidHook";

import ActivityForm from "@/pages/Module/components/ActivityFormDispatcher";
import type { Module, ActivityType, Activity } from "@/types";

export default function RepetitionAddWordOrPhrasePage() {
  const [module, setModule] = useState<Module | null>(null);
  const [activityType, setActivityType] = useState<ActivityType>("word");

  const uid = useUid();
  const busy = useBusy()
  const alert = useAlert()
  const navigate = useNavigate()
  const { t } = useTranslation();

  const createActivity = (type: ActivityType): Activity | null => {
    switch (type) {
      case "word":
        return {
          type,
          word: "",
          translation: "",
          context: "",
          synonyms: "",
        };
      case "phrase":
        return {
          type,
          phrase: "",
          translation: "",
        };
    }
    return null;
  };

  useEffect(() => {
    const module = {
      parent: uid(),
      name: "",
      type: "custom-activity",
      activity: createActivity(activityType),
      enabled: true,
      position: dayjs().valueOf(),
    } as Module;

    setModule(module);
  }, [uid, activityType]);

  if (!module) {
    return null;
  }

  const submit = async (module: Module) => {
    busy(true)
    const created = await modules.create(module)
    if (created) {
      await repetition.start(uid(), created.id || '')
      busy(false)
      alert('Saved')
      navigate('/learning')
    }
  }
  return (
    <div className="card">
      <div className="card-header">
        <ul className="nav nav-pills card-header-pills">
          <li className="nav-item">
            <a
              className={classNames("nav-link", {
                active: activityType === "word",
              })}
              href="#"
              onClick={() => setActivityType("word")}
            >
              {t("RepetitionPageAdd.word")}
            </a>
          </li>
          <li className="nav-item">
            <a
              className={classNames("nav-link", {
                active: activityType === "phrase",
              })}
              href="#"
              onClick={() => setActivityType("phrase")}
            >
              {t("RepetitionPageAdd.phrase")}
            </a>
          </li>
        </ul>
      </div>
      <div className="card-body">
        {<ActivityForm module={module} onSubmit={submit} />}
      </div>
    </div>
  );
}
