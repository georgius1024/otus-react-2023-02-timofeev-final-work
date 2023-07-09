import { useState, useEffect } from "react";
import uniq from "lodash.uniq";
import classNames from "classnames";

import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";

import { PhraseActivityStepProps } from "@/pages/Learning/components/ActivityTypes";

export default function PhraseReverseTranslationStep(props: PhraseActivityStepProps) {
  const busy = useBusy();
  const [phrases, setPhrases] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    busy(true);
    modules
      .findWords("phrase")
      .then((list) => {
        const phrases = uniq([
          props.activity.phrase,
          ...modules.similarWords(props.activity.phrase, list, 100),
        ]).slice(0, 6);

        setPhrases(modules.shuffle<string>(phrases));
      })
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy, props.activity.phrase]);

  const listSelectHandler = (selection: string) => {
    const solved = selection === props.activity.phrase;
    setSelected(selection);
    props.onSolved(solved);
  };

  return (
    <>
      <h5 className="card-title">Please select proper translation for the phrase</h5>
      <p>{props.activity.translation}</p>
      <ul className="list-group list-group-flush">
        {phrases.map((phrase) => (
          <li
            className={classNames("list-group-item", "list-group-item-action", {
              active: selected === phrase,
            })}
            key={phrase}
            onClick={() => listSelectHandler(phrase)}
          >
            {phrase}
          </li>
        ))}
      </ul>
    </>
  );
}
