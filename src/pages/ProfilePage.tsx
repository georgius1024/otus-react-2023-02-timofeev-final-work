import { ReactElement, FormEventHandler, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


import classNames from "classnames";
import Form from "react-formal";
import * as yup from "yup";

import { updateProfile } from "@/store/auth";
import uploadImage from "@/services/uploadImage";

import type { User, ErrorResponse } from "@/types";

const userSchema: any = yup.object<User>({
  name: yup.string().required(),
  avatar: yup.string().required()
});

import useAlert from "@/utils/AlertHook";
import useUid from "@/utils/UidHook";
import useErrorHandler from "@/utils/ErrorHook"

import { AppDispatch, RootState } from "@/store";

import Card from "@/components/Card";
import FormGroup from "@/components/FormGroup";

export default function ProfilePage(): ReactElement {
  const [fileName, setFileName] = useState<string|null>(null)
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const busy = useSelector((state: RootState) => state.auth.busy);
  const current = useSelector((state: RootState) => state.auth.user);
  const email = useSelector((state: RootState) => state.auth.auth?.email);
  
  const alert = useAlert();
  const uid = useUid();
  const { t } = useTranslation();
  const errorHandler = useErrorHandler()

  const onSubmit = async (profile: User) => {
    const { error } = (await dispatch(
      updateProfile({
        profile: { ...profile, uid: uid(), email: email as string },
      })
    )) as ErrorResponse;
    if (!error) {
      alert(t("ProfilePage.confirm"), "success");
      navigate("/");
    } else {
      alert(error.message, "warning");
      errorHandler(error as Error)
    }
  };

  // const upload: FormEventHandler<HTMLFormElement> = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  // }

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const file = files?.[0] || null
    if (file) {
      const ext = file.name.split('.').at(-1)?.toLowerCase()
      if (ext) {
        const fileName = `/profiles/${uid()}.${ext}`
        setFileName
        uploadImage(file, fileName)
      }
    }
  };  
  
  return (
    <Card title={t("ProfilePage.title")} modules={8}>
      <div
        className={classNames("alert alert-info", {
          "d-none": Boolean(current),
        })}
        role="alert"
      >
        {t("ProfilePage.new-user")}
      </div>

      {/* <form onSubmit={upload}>
      <div className="row">
        <div className="col-8">
          <label className="btn btn-default p-0">
            <input type="file" accept="image/*" onChange={selectFile}/>
          </label>
        </div>
        </div>
        </form>   */}
      <Form schema={userSchema} onSubmit={onSubmit} defaultValue={current}>
        <Form.Field
          className="d-none"
          name="name"
          type="hidden"
        />

        <FormGroup label={t("ProfilePage.form.name.label")}>
          <Form.Field
            className="form-control shadow-none w-100"
            name="name"
            type="text"
            placeholder={t("ProfilePage.form.name.placeholder")}
          />
          <Form.Message for="name" className="text-danger mb-3 p-1 d-block" />
        </FormGroup>
        <Form.Submit
          className="btn btn-primary light-text me-3"
          disabled={busy}
        >
          {t("ProfilePage.buttons.save")}
        </Form.Submit>
        <Form.Reset className="btn btn-outline-primary" disabled={busy}>
        {t("ProfilePage.buttons.reset")}
        </Form.Reset>
      </Form>
    </Card>
  );
}
