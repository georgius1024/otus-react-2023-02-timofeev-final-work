import PhrasePuzzleStep from "./PhrasePuzzleStep";
import Card from "../../../components/Card";
import "./ActivityStyles.scss";
export default {
  component: PhrasePuzzleStep,
  title: "activities/phrase/PhrasePuzzleStep",
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
    phrase: "One two three",
    translation: "Один два три",
  };
  const onSolved = (correct) => alert(correct);
  return (
    <Card title="Activity">
      <div className="phrase-activity">
        <div className="puzzle-step">
          <PhrasePuzzleStep activity={activity} onSolved={onSolved} />
        </div>
      </div>
    </Card>
  );
}
