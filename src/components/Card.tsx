import { PropsWithChildren } from "react";
type CardProps = {
  title: string;
  modules?: number;
  mt?: boolean;
};
export default function Card(props: PropsWithChildren<CardProps>) {
  const modules = props.modules || 4
  const className=`col-lg-${modules} offset-lg-${Math.floor(12 - modules) / 2}`
  return (
    <div className="`row ${props.mt === false ? null : 'mt-5'}`">
      <div className={className}>
        <div className="card">
          <h5 className="card-header bg-primary text-light">{props.title}</h5>
          <div className="card-body">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
