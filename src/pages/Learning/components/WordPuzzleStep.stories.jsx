import WordPuzzleStep from "./WordPuzzleStep";
import Card from "../../../components/Card";
import "./ActivityStyles.scss";
export default {
  component: WordPuzzleStep,
  title: "activities/word/WordPuzzleStep",
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
    word: "word",
    translation: "слово",
  };
  
  const onSolved = (correct) => setTimeout(() => alert(correct), 10);
  
  return (
    <Card title="Activity">
      <div className="word-activity">
        <div className="puzzle-step">
          <WordPuzzleStep activity={activity} onSolved={onSolved} />
        </div>
      </div>
    </Card>
  );
}
