import Placeholder from "@/components/Placeholder";

export default function GenericLoadingState() {
  return (
    <div className="container-fluid mt-4">
      <div className="row mt-3">
        <div className="col">
          <Placeholder height="24px" rounded />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <Placeholder height="24px" rounded />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <Placeholder height="24px" rounded />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <Placeholder height="24px" rounded />
        </div>
      </div>
    </div>
  );

}