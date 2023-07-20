import { Provider } from "react-redux";

import WordReverseTranslationStep from "./WordReverseTranslationStep";
import Card from "../../../components/Card";
import { store } from "../../../store";

export default {
  component: WordReverseTranslationStep,
  title: "activities/word/WordReverseTranslationStep",
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
    type: "word",
    word: "word",
    translation: "Слово",
  };
  const variants = [
    "word",
    "hord",
    "cord",
    "board",
  ];
  
  const onSolved = (correct) => setTimeout(() => alert(correct), 10);
  
  return (
    <Provider store={store}>
      <Card title="Activity" modules={6}>
        <WordReverseTranslationStep
          activity={activity}
          variants={variants}
          onSolved={onSolved}
        />
      </Card>
    </Provider>
  );
}
