import { PropsWithChildren } from "react";
type GroupProps = {
  label: string;
};

export default function FormGroup(props: PropsWithChildren<GroupProps>) {
  return (
    <div className="mb-3">
      <label className="form-label d-block">
        {props.label}
        {props.children}
      </label>
    </div>
  );
}
