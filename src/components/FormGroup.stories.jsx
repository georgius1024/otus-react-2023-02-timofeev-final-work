import { jsxDecorator } from "storybook-addon-jsx";

import FormGroup from "./FormGroup"
export default {
  title: 'FormGroup',
  decorators: [jsxDecorator],
  component: FormGroup,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },  
};

export const Default = {
  args: {
    label: 'Label',
    children: <input className="form-control shadow-none w-100" style={{maxWidth: '420px'}} placeholder="input here" />
  },
};