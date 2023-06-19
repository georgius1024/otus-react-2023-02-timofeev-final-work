import { ReactElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useAlert from "@/utils/AlertHook";

import { login } from "@/store/auth";
import { AppDispatch } from "@/store";

import Card from "@/components/Card";
import FormGroup from "@/components/FormGroup";
import FormInput from "@/components/FormInput";

import type { ErrorResponse } from "@/types";

export default function Login(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const alert = useAlert()

  const emailChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };
  const passwordChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(event.target.value);
  };

  const submit = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.preventDefault();
    const { error } = (await dispatch(
      login({ email, password })
    )) as ErrorResponse;
    if (!error) {

      alert("Welcome back", 'success');
      navigate("/");
    } else {
      alert(error.message, 'warning');
    }
  };

  return (
    <Card title="Login">
      <form name="login">
        <FormGroup label="Email">
          <FormInput
            value={email}
            type="email"
            name="email"
            onInput={emailChanged}
            placeholder="name@example.com"
          />
        </FormGroup>
        <FormGroup label="Password">
          <FormInput
            value={password}
            type="password"
            onInput={passwordChanged}
          />
        </FormGroup>
        <button
          className="btn btn-primary d-block w-100 my-3"
          type="button"
          onClick={submit}
        >
          Login
        </button>
        <Link to="/forgot">Forgot password?</Link>
      </form>
    </Card>
  );
}
