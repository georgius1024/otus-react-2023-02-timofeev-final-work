import Form, { useField } from "react-formal";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import classNames from "classnames";

type MDFieldProps = {
  name: string;
  label: string;
  preview: string;
  placeholder: string;
};

export default function MDField(props: MDFieldProps) {
  const [page, setPage] = useState<"edit" | "preview">("edit");
  const [addon, meta] = useField(props.name);

  return (
    <>
      <ul className="nav nav-pills">
        <li className="nav-item">
          <div
            className={classNames("nav-link", { active: page === "edit" })}
            onClick={() => setPage("edit")}
          >
            {props.label}
          </div>
        </li>
        <li className="nav-item">
          <div
            className={classNames("nav-link", {
              active: page === "preview",
            })}
            onClick={() => setPage("preview")}
          >
            {props.preview}
          </div>
        </li>
      </ul>
      <div className="mb-4">
        {page === "edit" && (
          <Form.Field
            className={classNames("form-control shadow-none w-100", {'invalid-field': meta.invalid})}
            style={{width: '100%'}}
            type="text"
            as="textarea"
            rows={8}
            placeholder={props.placeholder}
            {...addon}
          />
        )}
        {page === "preview" && (
          <div 
          className="border border-1 border-primary-subtle p-2"
          style={{minHeight: '100px'}}
          >
            <ReactMarkdown>{addon.value}</ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
}
