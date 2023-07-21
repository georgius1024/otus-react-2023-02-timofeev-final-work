import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import * as modules from "@/services/modules";
import Placeholder from "@/components/Placeholder";

import * as repetition from "@/services/repetition";
import useUid from "@/utils/UidHook";
import type { Module, RepetitionRecord } from "@/types";
type StatsEntry = {
  module: Module;
  title: string;
  repetition: RepetitionRecord;
};

export default function StatsPage() {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [stats, setStats] = useState<StatsEntry[]>([]);

  const uid = useUid();
  const { t } = useTranslation();

  const fetchAll = useCallback(async () => {
    const [plan, history] = await Promise.all([
      repetition.plan(uid()),
      repetition.history(uid()),
    ]);
    const mapRepetitions = new Map<string, RepetitionRecord>(
      [...plan, ...history].map((r) => [r.moduleId, r])
    );

    const promises = [...plan, ...history]
      .map((e) => e.moduleId)
      .map((id) => modules.fetchOne(id));

    const words = await Promise.all(promises);

    const stats = words
      .map((module) => {
        const repetition = mapRepetitions.get(module?.id || "");
        if (repetition && module) {
          // @ts-ignore
          const title = module.activity.word || module.activity.phrase;
          return {
            title,
            module,
            repetition,
          };
        }
      })
      .filter(Boolean) as StatsEntry[];
    setStats([...stats.sort((a, b) => a.title.trim().localeCompare(b.title))]);
  }, [uid]);
  useEffect(() => {
    setLoading(true);
    fetchAll()
      .finally(() => setLoading(false));
  }, [fetchAll]);

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
    <div className="layout-fluid mt-4">
      <h1>{t("StatsPage.title")}</h1>
      <ul className="list-group list-group-flush">
        {stats.map((e) => (
          <li
            key={e.module.id}
            className="list-group-item d-flex justify-content-between"
          >
            <span>{e.title}</span>
            <span>
              [
              {e.repetition.finishedAt
                ? t("StatsPage.finished")
                : t("StatsPage.next-repeat", {at: dayjs(e.repetition.scheduledAt).fromNow()})
              }]
            </span>
          </li>
        ))}
      </ul>
      <hr/>
      <div className="mt-3 ms-3">
        {t("StatsPage.total", {total: stats.length})}
      </div>
    </div>
  );
}
