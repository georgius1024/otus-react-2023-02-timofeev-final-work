import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import uniq from "lodash.uniq";
import classNames from "classnames";

import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";

import { PhraseActivityStepProps } from "@/pages/Learning/components/ActivityTypes";

export default function PhraseDirectTranslationStep(
  props: PhraseActivityStepProps
) {
  const [translations, setTranslations] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const busy = useBusy();
  const { t } = useTranslation();

  useEffect(() => {
    if (props.variants) {
      setTranslations(modules.shuffle<string>(props.variants));
      return 
    }
    busy(true);
    modules
      .findTranslations('phrase')
      .then((list) => {
        const translations = uniq([
          props.activity.translation,
          ...modules.similarWords(props.activity.translation, list, 100),
        ]).slice(0, 6);
        setTranslations(modules.shuffle<string>(translations));
      })
      .finally(() => busy(false));
  }, [busy, props.activity.translation, props.variants]);

  const listSelectHandler = (selection: string) => {
    const solved = selection === props.activity.translation;
    setSelected(selection);
    props.onSolved(solved);
  };

  return (
    <>
      <h5 className="card-title">
        {t("Activities.phrase.direct-translation.title", {phrase: props.activity.phrase})}
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
