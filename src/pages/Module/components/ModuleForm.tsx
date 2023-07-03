import Form from 'react-formal';
import * as yup from 'yup';

import FormGroup from "@/components/FormGroup";

import type { Module } from "@/types";

//@ts-nocheck
const moduleSchema: any = yup.object({
  name: yup.string().required()
});

type OnSubmit = (module: Module) => void;

type ModuleFormProps = {
  module: Module;
  onSubmit: OnSubmit;
};

export default function ModuleForm(props: ModuleFormProps) {
  return (
    <Form schema={moduleSchema} onSubmit={props.onSubmit} defaultValue={props.module}>
      <FormGroup label="Name">
        <Form.Field className="form-control shadow-none w-100" name="name" type="text"
          placeholder={`enter ${props.module.type} name here...`}
        />
        <Form.Message for="name" className="text-fanger mb-3 p-1 d-block" />
      </FormGroup>
      <Form.Submit className="btn btn-primary light-text me-3">
        Save
      </Form.Submit>
    </Form>
  );
}
