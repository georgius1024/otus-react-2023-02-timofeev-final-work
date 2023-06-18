import { PropsWithChildren } from "react";
type CardProps = {
  title: string;
};
export default function Card(props: PropsWithChildren<CardProps>) {
  return (
    <div className="row mt-5">
      <div className="col-lg-4 offset-lg-4">
        <div className="card">
          <h5 className="card-header bg-primary text-light">{props.title}</h5>
          <div className="card-body">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
