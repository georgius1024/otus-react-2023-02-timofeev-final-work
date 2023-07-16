import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import useAlert from "@/utils/AlertHook";
import { forgot } from "@/store/auth";
import type { AppDispatch, RootState } from "@/store";

import Card from "@/components/Card";
import FormGroup from "@/components/FormGroup";
import FormInput from "@/components/FormInput";

import type { ErrorResponse } from "@/types";

export default function ForgotPage(): ReactElement {
  const [email, setEmail] = useState<string>("");
  const busy = useSelector((state: RootState) => state.auth.busy);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { t } = useTranslation();

  const emailChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const submit = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.preventDefault();
    const { error } = (await dispatch(forgot({ email }))) as ErrorResponse;
    if (!error) {
      alert("We sent reset password recovery email", "success");
      navigate("/login");
    } else {
      alert(error.message, "warning");
    }
  };

  return (
    <Card title={t('ForgotPage.title')}>
      <form name="forgot">
      <FormGroup label={t('ForgotPage.email.label')}>
          <FormInput
            value={email}
            type="email"
            name="email"
            onInput={emailChanged}
            placeholder="name@example.com"
          />
        </FormGroup>
        <button
          disabled={busy}
          className="btn btn-primary d-block w-100 my-3"
          type="button"
          onClick={submit}
        >
          {t('ForgotPage.submit')}
        </button>
      </form>
    </Card>
  );
}
