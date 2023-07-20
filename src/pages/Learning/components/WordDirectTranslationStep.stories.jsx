import { Provider } from "react-redux";

import WordDirectTranslationStep from "./WordDirectTranslationStep";
import Card from "../../../components/Card";
import { store } from "../../../store";

export default {
  component: WordDirectTranslationStep,
  title: "activities/word/WordDirectTranslationStep",
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
    translation: "слово",
  };
  const variants = [
    "слово",
    "олово",
    "плов",
    "сплав",
  ];
  
  const onSolved = (correct) => setTimeout(() => alert(correct), 10);
  
  return (
    <Provider store={store}>
      <Card title="Activity" modules={6}>
        <WordDirectTranslationStep
          activity={activity}
          variants={variants}
          onSolved={onSolved}
        />
      </Card>
    </Provider>
  );
}
