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


export default function WordDirectTranslation(props: WordActivityProps) {
  const busy = useBusy();
  const [translations, setTranslations] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [rejected, setRejected] = useState<boolean>(false);
  useEffect(() => {
    busy(true);
    modules
      .findTranslations()
      .then((list) => {
        const translations = uniq([
          props.activity.translation,
          ...modules.similarWords(props.activity.translation, list, 100),
        ]).slice(0, 6);
        setTranslations(modules.shuffle<string>(translations));
      })
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy, props.activity.translation]);

  const listSelectHandler = (selection: string) => {
    if (selection === props.activity.translation) {
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
      <h5 className="card-title">
        Please select proper translation for the word "{props.activity.word}"
      </h5>
      <ul
        className={classNames("list-group", "list-group-flush", {
          "animated-rejected": rejected,
        })}
      >
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
