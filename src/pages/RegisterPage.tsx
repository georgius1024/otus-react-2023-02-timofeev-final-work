import { ReactElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import useAlert from "@/utils/AlertHook";

import { register } from "@/store/auth";
import { AppDispatch, RootState } from "@/store";

import Card from "@/components/Card";
import FormGroup from "@/components/FormGroup";
import FormInput from "@/components/FormInput";

import type { ErrorResponse } from "@/types";

export default function RegisterPage(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const busy = useSelector((state: RootState) => state.auth.busy);

  const alert = useAlert()
  const { t } = useTranslation();

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
      register({ email, password })
    )) as ErrorResponse;
    if (!error) {
      alert("Thank you for registration");
      navigate("/");
    } else {
      alert(error.message, 'warning');
    }
  };

  return (
    <Card title={t('RegisterPage.title')}>
    <form name="register">
    <FormGroup label={t('RegisterPage.email.label')}>
          <FormInput
            value={email}
            type="email"
            name="email"
            onInput={emailChanged}
            placeholder="name@example.com"
          />
        </FormGroup>
        <FormGroup label={t('RegisterPage.password.label')}>
          <FormInput
            value={password}
            type="password"
            onInput={passwordChanged}
          />
        </FormGroup>
        <button
          disabled={busy}
          className="btn btn-primary d-block w-100 my-3"
          type="button"
          onClick={submit}
        >
          {t('RegisterPage.submit')}
        </button>
        <Link to="/forgot">{t('RegisterPage.forgot')}</Link>
      </form>
    </Card>
  );
}
