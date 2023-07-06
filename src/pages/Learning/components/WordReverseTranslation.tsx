import { useState, useEffect } from "react";
import uniq from "lodash.uniq";
import classNames from "classnames";

import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";

import type { WordActivity } from "@/types";

type OnDone = (force?: boolean) => void;

type WordActivityProps = {
  activity: WordActivity;
  onDone: OnDone;
};

export default function WordReverseTranslation(props: WordActivityProps) {
  const busy = useBusy();
  const [words, setWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [rejected, setRejected] = useState<boolean>(false);
  useEffect(() => {
    busy(true);
    modules
      .findWords()
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
    if (selection === props.activity.word) {
      setSelected(selection);
      props.onDone(true);
    } else {
      const timer = setTimeout(() => setRejected(false), 1000);
      setRejected(true);
      return () => clearTimeout(timer);
    }
  };

  return (
    <>
      <h5 className="card-title">Please select proper translation for the word "{props.activity.translation}"</h5>
      <ul
        className={classNames("list-group", "list-group-flush", {
          "animated-rejected": rejected,
        })}
      >
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
