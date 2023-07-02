import Form from 'react-formal';
import * as yup from 'yup';

import FormGroup from "@/components/FormGroup";
import FormInput from "@/components/FormInput";

import type { Module } from "@/types";

//@ts-nocheck
const ActivitySchema: any = yup.object({
  phrase: yup.string().required(),
  translation: yup.string().required()
});

type OnSubmit = (module: Module) => void;

type ActivityFormProps = {
  module: Module;
  onSubmit: OnSubmit;
};

export default function PhraseActivityForm(props: ActivityFormProps) {
  return (
    <Form schema={ActivitySchema} onSubmit={props.onSubmit} value={props.module}>
      <FormGroup label="Phrase">
        <Form.Field as={FormInput} name="word" type="text"
          placeholder="enter foreign phrase here..."
        />
        <Form.Message for="word" className="text-fanger mb-3 p-1 d-block" />
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
