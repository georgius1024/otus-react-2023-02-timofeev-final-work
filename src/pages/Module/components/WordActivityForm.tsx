import Form from 'react-formal';
import * as yup from 'yup';

import FormGroup from "@/components/FormGroup";

import type { Activity, WordActivity } from "@/types";

//@ts-nocheck
const ActivitySchema: any = yup.object({
  word: yup.string().required(),
  translation: yup.string().required(),
  context: yup.string(),
  synonyms: yup.string()
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
        <Form.Field className="form-control shadow-none w-100" name="word" type="text"
          placeholder="enter foreign word here..."
        />
        <Form.Message for="word" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>
      <FormGroup label="Translation">
        <Form.Field className="form-control shadow-none w-100" name="translation" type="text"
          placeholder="enter translation here..."
        />
        <Form.Message for="translation" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>
      <FormGroup label="Context">
        <Form.Field as="textarea" className="form-control shadow-none w-100" name="context" type="text" rows={4}
          placeholder="enter context here..."
        />
        <Form.Message for="context" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>
      <FormGroup label="Synonyms">
        <Form.Field as="textarea" className="form-control shadow-none w-100" name="synonyms" type="text" rows={4}
          placeholder="enter synonyms here..."
        />
        <Form.Message for="synonyms" className="text-danger mb-3 p-1 d-block" />
      </FormGroup>

      <Form.Submit className="btn btn-primary light-text me-3">
        Save
      </Form.Submit>
      <Form.Reset className="btn btn-outline-primary">
        Reset
      </Form.Reset>
    </Form>
  );
}
