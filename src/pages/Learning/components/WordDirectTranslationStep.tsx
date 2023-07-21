import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import uniq from "lodash.uniq";
import classNames from "classnames";

import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";

import { WordActivityStepProps } from "@/pages/Learning/components/ActivityTypes";

export default function WordDirectTranslationStep(
  props: WordActivityStepProps
) {

  const busy = useBusy();
  const { t } = useTranslation();

  const [translations, setTranslations] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    busy(true);
    modules
      .findTranslations('word')
      .then((list) => {
        const translations = uniq([
          props.activity.translation,
          ...modules.similarWords(props.activity.translation, list, 100),
        ]).slice(0, 6);
        setTranslations(modules.shuffle<string>(translations));
      })
      .finally(() => busy(false));
  }, [busy, props.activity.translation]);

  const listSelectHandler = (selection: string) => {
    const solved = selection === props.activity.translation;
    setSelected(selection);
    props.onSolved(solved);
  };

  return (
    <>
      <h5 className="card-title">
        {t("Activities.word.direct-translation.title", {word: props.activity.word})}
      </h5>
      <ul className="list-group list-group-flush">
        {translations.map((translation) => (
          <li
            className={classNames("list-group-item", "list-group-item-action", {
              active: selected === translation,
            })}
            key={translation}
            onClick={() => listSelectHandler(translation)}
          >
            {translation}
          </li>
        ))}
      </ul>
    </>
  );
}
