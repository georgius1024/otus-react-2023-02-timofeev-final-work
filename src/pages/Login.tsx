import { ReactElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "@/store/auth";
import { AppDispatch } from "@/store";
import { success, warning } from "@/utils/message";

import Card from "@/components/Card";
import FormGroup from "@/components/FormGroup";

import type { ErrorResponse } from "@/types";

export default function Login(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
      success("Welcome back");
      navigate("/");
    } else {
      warning(error.message);
    }
  };

  return (
    <Card title="Login">
      <form name="login">
        <FormGroup label="Email">
          <input
            className="form-control shadow-none w-100"
            value={email}
            type="email"
            name="email"
            onInput={emailChanged}
            placeholder="name@example.com"
          />
        </FormGroup>
        <FormGroup label="Password">
          <input
            className="form-control shadow-none w-100"
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
