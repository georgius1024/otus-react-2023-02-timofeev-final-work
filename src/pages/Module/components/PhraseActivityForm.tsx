import Form from "react-formal";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import FormGroup from "@/components/FormGroup";

import type { Activity, PhraseActivity } from "@/types";

//@ts-nocheck
const ActivitySchema: any = yup.object({
  phrase: yup.string().required(),
  translation: yup.string().required(),
  enabled: yup.boolean().required(),
});

type OnSubmit = (activity: Activity) => void;

type ActivityFormProps = {
  activity: Activity;
  onSubmit: OnSubmit;
};

export default function PhraseActivityForm(props: ActivityFormProps) {
  const { t } = useTranslation();
  return (
    <Form
      schema={ActivitySchema}
      onSubmit={props.onSubmit}
      defaultValue={props.activity as PhraseActivity}
    >
      <FormGroup label={t("ActivityForm.phrase.phrase.label")}>
        <Form.Field
          className="form-control shadow-none w-100"
          name="phrase"
          type="text"
          placeholder={t("ActivityForm.phrase.phrase.placeholder")}
        />
        <Form.Message for="phrase" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>
      <FormGroup label={t("ActivityForm.phrase.translation.label")}>
        <Form.Field
          className="form-control shadow-none w-100"
          name="translation"
          type="text"
          placeholder={t("ActivityForm.phrase.translation.placeholder")}
        />
        <Form.Message
          for="translation"
          className="text-danger mb-3 p-1 d-block"
        />
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
