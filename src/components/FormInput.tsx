type OnInput = (event: React.ChangeEvent<HTMLInputElement>) => void;
type InputProps = {
  type: string;
  name?: string;
  min?: number;
  max?: number;
  step?: number;
  value: string | number;
  placeholder?: string;
  onInput?: OnInput;
};

export default function FormInput(props: InputProps) {
  return <input className="form-control shadow-none w-100" {...props} />;
}
