import Form from 'react-formal';
import * as yup from 'yup';

import FormGroup from "@/components/FormGroup";
import FormInput from "@/components/FormInput";

import type { Activity } from "@/types";

//@ts-nocheck
const ActivitySchema: any = yup.object({
  header: yup.string().required(),
  slide: yup.string().required()
});

type OnSubmit = (activity: Activity) => void;

type ActivityFormProps = {
  activity: Activity;
  onSubmit: OnSubmit;
};

export default function SlideActivityForm(props: ActivityFormProps) {
  return (
    <Form schema={ActivitySchema} onSubmit={props.onSubmit} value={props.activity}>
      <FormGroup label="Header">
        <Form.Field as={FormInput} name="word" type="text"
          placeholder="enter foreign phrase here..."
        />
        <Form.Message for="word" className="text-fanger mb-3 p-1 d-block" />
      </FormGroup>
      <FormGroup label="Translation">
        <Form.Field as={FormInput} name="slide" type="text"
          placeholder="enter translation here..."
        />
        <Form.Message for="slide" className="text-fanger mb-3 p-1 d-block" />
      </FormGroup>
      <Form.Submit className="btn btn-primary light-text me-3">
        Save
      </Form.Submit>
    </Form>
  );
}
