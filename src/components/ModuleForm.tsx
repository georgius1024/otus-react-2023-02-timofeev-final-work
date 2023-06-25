import FormGroup from "@/components/FormGroup";
import FormInput from "@/components/FormInput";

import type { Module } from "@/types";

type OnChange = (module: Module) => void;

type ModuleFormProps = {
  module: Module;
  onChange: OnChange;
};

export default function ModuleForm(props: ModuleFormProps) {
  const nameChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    props.onChange({ ...props.module, name: event.target.value });
  };

  return (
    <FormGroup label="Name">
      <FormInput
        type="text"
        placeholder="enter name here..."
        value={props.module.name}
        onInput={nameChanged}
      />
    </FormGroup>
  );
}
