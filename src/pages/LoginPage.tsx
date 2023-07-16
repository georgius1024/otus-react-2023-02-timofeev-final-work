import { ReactElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import useAlert from "@/utils/AlertHook";

import { login } from "@/store/auth";
import { AppDispatch, RootState } from "@/store";

import Card from "@/components/Card";
import FormGroup from "@/components/FormGroup";
import FormInput from "@/components/FormInput";

import type { ErrorResponse } from "@/types";

export default function LoginPage(): ReactElement {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const busy = useSelector((state: RootState) => state.auth.busy);

  const alert = useAlert()
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
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
      login({ email, password })
    )) as ErrorResponse;
    if (!error) {
      alert(t('LoginPage.confirm'), "success");
      navigate("/");
    } else {
      alert(error.message, 'warning');
    }
  };

  return (
    <Card title={t('LoginPage.title')}>
      <form name="login">
        <FormGroup label={t('LoginPage.email.label')}>
          <FormInput
            value={email}
            type="email"
            name="email"
            onInput={emailChanged}
            placeholder="name@example.com"
          />
        </FormGroup>
        <FormGroup label={t('LoginPage.password.label')}>
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
          {t('LoginPage.submit')}
        </button>
        <Link to="/forgot">{t('LoginPage.forgot')}</Link>
      </form>
    </Card>
  );
}
