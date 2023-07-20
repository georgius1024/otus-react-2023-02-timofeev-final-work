import PhraseLearnStep from "./PhraseLearnStep";
import Card from "../../../components/Card";

export default {
  component: PhraseLearnStep,
  title: "activities/phrase/PhraseLearnStep",
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
    type: "phrase",
    phrase: "Pharse on foreign language",
    translation: "Translation to native language",
  };
  const onSolve = () => null
  return (
    <Card title="Activity">
      <PhraseLearnStep activity={activity} onSolve={onSolve} />
    </Card>
  );
}
