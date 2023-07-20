import WordLearnStep from "./WordLearnStep";
import Card from "../../../components/Card";

export default {
  component: WordLearnStep,
  title: "activities/word/WordLearnStep",
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
  },
};

export function Default() {
  const activity = {
    type: "word",
    word: "Word",
    translation: "Translation",
  };
  const onSolved = () => null
  return (
    <Card title="Activity">
      <WordLearnStep activity={activity} onSolved={onSolved} />
    </Card>
  );
}
