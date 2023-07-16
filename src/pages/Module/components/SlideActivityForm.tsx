import Form from "react-formal";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import FormGroup from "@/components/FormGroup";

import type { Activity, SlideActivity } from "@/types";

//@ts-nocheck
const ActivitySchema: any = yup.object({
  header: yup.string().required(),
  slide: yup.string().required(),
});

type OnSubmit = (activity: Activity) => void;

type ActivityFormProps = {
  activity: Activity;
  onSubmit: OnSubmit;
};

export default function SlideActivityForm(props: ActivityFormProps) {
  const { t } = useTranslation();

  return (
    <Form
      schema={ActivitySchema}
      onSubmit={props.onSubmit}
      defaultValue={props.activity as SlideActivity}
    >
      <FormGroup label={t("ActivityForm.slide.header.label")}>
        <Form.Field
          className="form-control shadow-none w-100"
          name="header"
          type="text"
          placeholder={t("ActivityForm.slide.header.placeholder")}
        />
        <Form.Message for="header" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>
      <FormGroup label={t("ActivityForm.slide.slide.label")}>
        <Form.Field
          as="textarea"
          className="form-control shadow-none w-100"
          name="slide"
          type="text"
          rows={8}
          placeholder={t("ActivityForm.slide.slide.placeholder")}
        />
        <Form.Message for="slide" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>
      <Form.Submit className="btn btn-primary light-text me-3">
        {t("ActivityForm.buttons.save")}
      </Form.Submit>
      <Form.Reset className="btn btn-outline-primary">
        {t("ActivityForm.buttons.reset")}
      </Form.Reset>
    </Form>
  );
}
