import Form from "react-formal";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import FormGroup from "@/components/FormGroup";
import MDField from "@/components/MDField";

import type { Module } from "@/types";

//@ts-nocheck
const moduleSchema: any = yup.object({
  name: yup.string().required(),
  enabled: yup.boolean().required(),
  intro: yup.string(),
});

type OnSubmit = (module: Module) => void;

type ModuleFormProps = {
  module: Module;
  onSubmit: OnSubmit;
};

export default function ModuleForm(props: ModuleFormProps) {
  const { t } = useTranslation();

  return (
    <Form
      schema={moduleSchema}
      onSubmit={props.onSubmit}
      defaultValue={props.module}
    >
      <FormGroup label={t("ModuleForm.name.label")}>
        <Form.Field
          className="form-control shadow-none w-100"
          name="name"
          type="text"
          placeholder={`enter ${props.module.type} name here...`}
        />
        <Form.Message for="name" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>
      <div className="form-check mb-3">
        <label className="form-check-label">
          <Form.Field
            type="checkbox"
            name="enabled"
            className="form-check-input"
          />{" "}
          {t("ModuleForm.enabled.label")}
        </label>
      </div>
      {props.module.type === "course" && (
        <MDField
          label={t("ModuleForm.intro.label")}
          preview={t("ModuleForm.intro.preview")}
          name="intro"
          placeholder={t("ModuleForm.intro.placeholder")}
        />
      )}
      <Form.Submit className="btn btn-primary light-text me-3">
        {t("ModuleForm.buttons.save")}
      </Form.Submit>
      <Form.Reset className="btn btn-outline-primary">
        {t("ModuleForm.buttons.reset")}
      </Form.Reset>
    </Form>
  );
}
