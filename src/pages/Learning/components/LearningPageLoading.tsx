import Placeholder from "@/components/Placeholder";

export default function LearningPageLoading() {
  return (
    <div className="container-fluid mt-4">
      <div className="row mt-2">
        <div className="col">
          <Placeholder width="33%" rounded />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <Placeholder width="66%" height="24px" rounded/>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <Placeholder width="33%" height="24px" rounded/>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <Placeholder width="50%" height="24px" rounded/>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <Placeholder width="25%" height="24px" rounded/>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <Placeholder width="100%" rounded />
        </div>
        <div className="col">
          <Placeholder width="100%" rounded />
        </div>
        <div className="col">
          <Placeholder width="100%" rounded />
        </div>
      </div>
 
    </div>
  );
}
