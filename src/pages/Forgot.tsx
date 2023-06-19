import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import useAlert from "@/utils/AlertHook";
import { forgot } from "@/store/auth";

import Card from "@/components/Card";
import FormGroup from "@/components/FormGroup";
import FormInput from "@/components/FormInput";

import type { ErrorResponse } from "@/types";

export default function ForgotPage(): ReactElement {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const alert = useAlert();
  const emailChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const submit = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.preventDefault();
    const { error } = (await dispatch(
      // @ts-ignore
      forgot({ email })
    )) as unknown as ErrorResponse;
    if (!error) {
      alert("We sent reset password recovery email", "success");
      navigate("/login");
    } else {
      alert(error.message, "warning");
    }
  };

  return (
    <Card title="Restore password">
      <form name="forgot">
        <FormGroup label="Email">
          <FormInput
            value={email}
            type="email"
            name="email"
            onInput={emailChanged}
            placeholder="name@example.com"
          />
        </FormGroup>
        <button
          className="btn btn-primary d-block w-100 my-3"
          type="button"
          onClick={submit}
        >
          Restore
        </button>
      </form>
    </Card>
  );
}
