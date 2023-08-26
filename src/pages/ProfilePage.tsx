import { ReactElement } from "react";
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
  avatar: yup.string().required(),
});

import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import useUid from "@/utils/UidHook";
import useErrorHandler from "@/utils/ErrorHook";

import { AppDispatch, RootState } from "@/store";

import Card from "@/components/Card";
import FormGroup from "@/components/FormGroup";

export default function ProfilePage(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const busy = useBusy();
  const authBusy = useSelector((state: RootState) => state.auth.busy);
  const current = useSelector((state: RootState) => state.auth.user);
  const email = useSelector((state: RootState) => state.auth.auth?.email);
  const avatarUrl = useSelector((state: RootState) => state.auth.user?.avatar);

  const alert = useAlert();
  const uid = useUid();
  const { t } = useTranslation();
  const errorHandler = useErrorHandler();

  const imageUrl = avatarUrl || "/avatar-default.svg";

  const updateProfileAndHandleError = async (profile: User) => {
    const { error } = (await dispatch(
      updateProfile({
        profile: { ...profile, uid: uid(), email: email as string },
      })
    )) as ErrorResponse;
    if (error) {
      throw error;
    }
  };

  const onSubmit = async (profile: User) => {
    try {
      await updateProfileAndHandleError(profile);
      alert(t("ProfilePage.confirm"), "success");
      navigate("/");
    } catch (error) {
      alert((error as Error).message, "warning");
      errorHandler(error as Error);
    }
  };

  const selectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    const { files } = event.target;
    const file = files?.[0] || null;
    if (file) {
      const ext = file.name.split(".").at(-1)?.toLowerCase();
      if (ext) {
        const fileName = `/profiles/${uid()}.${ext}`;
        busy(true);
        try {
          const newUrl = await uploadImage(file, fileName);
          await updateProfileAndHandleError({
            ...(current as User),
            avatar: newUrl,
          });
          alert(t("ProfilePage.confirm"), "success");
        } catch (error) {
          alert((error as Error).message, "warning");
          errorHandler(error as Error);
        } finally {
          busy(false);
        }
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

      <div className="row">
        <div className="col-8">
          <label className="btn btn-default p-0">
            <img
              src={imageUrl}
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
            <div className="d-none">
              <input type="file" accept="image/*" onChange={selectFile} />
            </div>
          </label>
        </div>
      </div>

      <Form schema={userSchema} onSubmit={onSubmit} defaultValue={current}>
        <Form.Field className="d-none" name="name" type="hidden" />

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
          disabled={authBusy}
        >
          {t("ProfilePage.buttons.save")}
        </Form.Submit>
        <Form.Reset className="btn btn-outline-primary" disabled={authBusy}>
          {t("ProfilePage.buttons.reset")}
        </Form.Reset>
      </Form>
    </Card>
  );
}
