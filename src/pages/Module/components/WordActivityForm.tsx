import Form from 'react-formal';
import * as yup from 'yup';

import FormGroup from "@/components/FormGroup";
import FormInput from "@/components/FormInput";

import type { Activity, WordActivity } from "@/types";

//@ts-nocheck
const ActivitySchema: any = yup.object({
  word: yup.string().required(),
  translation: yup.string().required()
});

type OnSubmit = (activity: Activity) => void;

type ActivityFormProps = {
  activity: Activity;
  onSubmit: OnSubmit;
};

export default function WordAcrivityForm(props: ActivityFormProps) {
  return (
    <Form schema={ActivitySchema} onSubmit={props.onSubmit} defaultValue={props.activity as WordActivity}>
      <FormGroup label="Word">
        <Form.Field as={FormInput} name="word" type="text"
          placeholder="enter foreign word here..."
        />
        <Form.Message for="word" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>
      <FormGroup label="Translation">
        <Form.Field as={FormInput} name="translation" type="text"
          placeholder="enter translation here..."
        />
        <Form.Message for="translation" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>
      <Form.Submit className="btn btn-primary light-text me-3">
        Save
      </Form.Submit>
    </Form>
  );
}
