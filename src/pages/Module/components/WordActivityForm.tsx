import Form from "react-formal";
import { useTranslation } from "react-i18next";

import * as yup from "yup";

import FormGroup from "@/components/FormGroup";

import type { Activity, WordActivity } from "@/types";

//@ts-nocheck
const ActivitySchema: any = yup.object({
  word: yup.string().required(),
  translation: yup.string().required(),
  context: yup.string(),
  enabled: yup.boolean().required(),
});

type OnSubmit = (activity: Activity) => void;

type ActivityFormProps = {
  activity: Activity & { enabled: boolean };
  onSubmit: OnSubmit;
};

export default function WordAcrivityForm(props: ActivityFormProps) {
  const { t } = useTranslation();
  return (
    <Form
      schema={ActivitySchema}
      onSubmit={props.onSubmit}
      defaultValue={props.activity as WordActivity}
    >
      <FormGroup label={t("ActivityForm.word.word.label")}>
        <Form.Field
          className="form-control shadow-none w-100"
          name="word"
          type="text"
          placeholder={t("ActivityForm.word.word.placeholder")}
        />
        <Form.Message for="word" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>
      <FormGroup label={t("ActivityForm.word.translation.label")}>
        <Form.Field
          className="form-control shadow-none w-100"
          name="translation"
          type="text"
          placeholder={t("ActivityForm.word.translation.placeholder")}
        />
        <Form.Message
          for="translation"
          className="text-danger mb-3 p-1 d-block"
        />
      </FormGroup>
      <FormGroup label={t("ActivityForm.word.context.label")}>
        <Form.Field
          as="textarea"
          className="form-control shadow-none w-100"
          name="context"
          type="text"
          rows={4}
          placeholder={t("ActivityForm.word.context.placeholder")}
        />
        <Form.Message for="context" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>
      <div className="form-check mb-3">
        <label className="form-check-label">
          <Form.Field
            type="checkbox"
            name="enabled"
            className="form-check-input"
          />{" "}
          {t("ActivityForm.enabled.label")}
        </label>
      </div>
      <Form.Submit className="btn btn-primary light-text me-3">
        {t("ActivityForm.buttons.save")}
      </Form.Submit>
      <Form.Reset className="btn btn-outline-primary">
        {t("ActivityForm.buttons.reset")}
      </Form.Reset>
    </Form>
  );
}
