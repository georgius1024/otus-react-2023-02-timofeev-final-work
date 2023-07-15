import { useNavigate } from "react-router";
export default function RepetitionPage() {
  const navigate = useNavigate();
  const openLearningPage = () => {
    navigate("/learning/");
  };
  return (
    <div className="container-fluid">
      <h1>Hello repetition</h1>
      <hr/>
      <button className="btn btn-secondary light-text" onClick={openLearningPage}>
          Back
      </button>
    </div>
  );
}
