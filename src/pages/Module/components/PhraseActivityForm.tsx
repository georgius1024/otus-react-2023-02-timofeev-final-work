import Form from 'react-formal';
import * as yup from 'yup';

import FormGroup from "@/components/FormGroup";
import FormInput from "@/components/FormInput";

import type { Activity, PhraseActivity } from "@/types";

//@ts-nocheck
const ActivitySchema: any = yup.object({
  phrase: yup.string().required(),
  translation: yup.string().required()
});

type OnSubmit = (activity: Activity) => void;

type ActivityFormProps = {
  activity: Activity;
  onSubmit: OnSubmit;
};

export default function PhraseActivityForm(props: ActivityFormProps) {
  return (
    <Form schema={ActivitySchema} onSubmit={props.onSubmit} defaultValue={props.activity as PhraseActivity}>
      <FormGroup label="Phrase">
        <Form.Field as={FormInput} name="phrase" type="text"
          placeholder="enter foreign phrase here..."
        />
        <Form.Message for="phrase" className="text-fanger mb-3 p-1 d-block" />
      </FormGroup>
      <FormGroup label="Translation">
        <Form.Field as={FormInput} name="translation" type="text"
          placeholder="enter translation here..."
        />
        <Form.Message for="translation" className="text-fanger mb-3 p-1 d-block" />
      </FormGroup>
      <Form.Submit className="btn btn-primary light-text me-3">
        Save
      </Form.Submit>
    </Form>
  );
}
