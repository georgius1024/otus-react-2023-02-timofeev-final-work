import { Provider } from "react-redux";

import PhraseDirectTranslationStep from "./PhraseDirectTranslationStep";
import Card from "../../../components/Card";
import { store } from "../../../store";

export default {
  component: PhraseDirectTranslationStep,
  title: "activities/phrase/PhraseDirectTranslationStep",
  argTypes: {
    onSolved: {
      table: {
        disable: true,
      },
    },
    activity: {
      table: {
        disable: true,
      },
    },
    variants: {
      table: {
        disable: true,
      },
    },
  },
};

export function Default() {
  const activity = {
    type: "phrase",
    phrase: "Pharse on foreign language",
    translation: "Correct translation to native language",
  };
  const variants = [
    "Correct translation to native language",
    "Incorrect translation to native language (1)",
    "Incorrect translation to native language (2)",
    "Incorrect translation to native language (3)",
  ];
  const onSolved = (correct) => alert(correct);
  return (
    <Provider store={store}>
      <Card title="Activity" modules={6}>
        <PhraseDirectTranslationStep
          activity={activity}
          variants={variants}
          onSolved={onSolved}
        />
      </Card>
    </Provider>
  );
}
