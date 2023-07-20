import { Provider } from "react-redux";

import PhraseReverseTranslationStep from "./PhraseReverseTranslationStep";
import Card from "../../../components/Card";
import { store } from "../../../store";

export default {
  component: PhraseReverseTranslationStep,
  title: "activities/phrase/PhraseReverseTranslationStep",
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
    phrase: "Correct pharse on foreign language",
    translation: "Translation of correct phrase to native language",
  };
  const variants = [
    "Correct pharse on foreign language",
    "Incorrect pharse on foreign language (1)",
    "Incorrect pharse on foreign language (2)",
    "Incorrect pharse on foreign language (3)",
  ];
  const onSolved = (correct) => alert(correct);
  return (
    <Provider store={store}>
      <Card title="Activity" modules={6}>
        <PhraseReverseTranslationStep
          activity={activity}
          variants={variants}
          onSolved={onSolved}
        />
      </Card>
    </Provider>
  );
}
