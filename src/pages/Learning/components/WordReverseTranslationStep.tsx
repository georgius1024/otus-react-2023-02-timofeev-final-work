import { useState, useEffect } from "react";
import uniq from "lodash.uniq";
import classNames from "classnames";

import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";

import { WordActivityStepProps } from "@/pages/Learning/components/ActivityTypes";

export default function WordReverseTranslationStep(props: WordActivityStepProps) {
  const busy = useBusy();
  const [words, setWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
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
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy, props.activity.word]);

  const listSelectHandler = (selection: string) => {
    const solved = selection === props.activity.word;
    setSelected(selection);
    props.onSolved(solved);
  };

  return (
    <>
      <h5 className="card-title">Please select proper translation for the word "{props.activity.translation}"</h5>
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
