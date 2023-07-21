import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import uniq from "lodash.uniq";
import classNames from "classnames";

import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";

import { WordActivityStepProps } from "@/pages/Learning/components/ActivityTypes";

export default function WordReverseTranslationStep(props: WordActivityStepProps) {
  const [words, setWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const busy = useBusy();
  const { t } = useTranslation();

  useEffect(() => {
    if (props.variants) {
      setWords(modules.shuffle<string>(props.variants));
      return 
    }
    busy(true);
    modules
      .findWords("word")
      .then((list) => {
        const words = uniq([
          props.activity.word,
          ...modules.similarWords(props.activity.word, list, 100),
        ]).slice(0, 6);

        setWords(modules.shuffle<string>(words));
      })
      .finally(() => busy(false));
  }, [busy, props.activity.word, props.variants]);

  const listSelectHandler = (selection: string) => {
    const solved = selection === props.activity.word;
    setSelected(selection);
    props.onSolved(solved);
  };

  return (
    <>
      <h5 className="card-title">
        {t("Activities.word.reverse-translation.title", {translation: props.activity.translation})}
      </h5>
      <ul className="list-group list-group-flush">
        {words.map((word) => (
          <li
            className={classNames("list-group-item", "list-group-item-action", {
              active: selected === word,
            })}
            key={word}
            onClick={() => listSelectHandler(word)}
          >
            {word}
          </li>
        ))}
      </ul>
    </>
  );
}
