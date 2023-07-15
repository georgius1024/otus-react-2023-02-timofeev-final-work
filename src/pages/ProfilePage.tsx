import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import Form from "react-formal";
import * as yup from "yup";

import { updateProfile } from "@/store/auth";

import type { User, ErrorResponse } from "@/types";

const userSchema: any = yup.object<User>({
  name: yup.string().required(),
});

import useAlert from "@/utils/AlertHook";

import { AppDispatch, RootState } from "@/store";

import Card from "@/components/Card";
import FormGroup from "@/components/FormGroup";

export default function ProfilePage(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const busy = useSelector((state: RootState) => state.auth.busy);
  const current = useSelector((state: RootState) => state.auth.user);
  const uid = useSelector((state: RootState) => state.auth.auth?.uid);
  const alert = useAlert();

  const onSubmit = async (profile: User) => {
    const { error } = (await dispatch(
      updateProfile({ profile: { ...profile, uid: uid || "" } })
    )) as ErrorResponse;
    if (!error) {
      alert("Profile updated", "success");
      navigate("/");
    } else {
      alert(error.message, "warning");
    }
  };

  return (
    <Card title="Profile">
      <div
        className={classNames("alert alert-warning", {
          "d-none": Boolean(current),
        })}
        role="alert"
      >
        Please, update your progile after registration
      </div>

      <Form schema={userSchema} onSubmit={onSubmit} defaultValue={current}>
        <FormGroup label="Name">
          <Form.Field
            className="form-control shadow-none w-100"
            name="name"
            type="text"
            placeholder={`enter your name here...`}
          />
          <Form.Message for="name" className="text-danger mb-3 p-1 d-block" />
        </FormGroup>
        <Form.Submit
          className="btn btn-primary light-text me-3"
          disabled={busy}
        >
          Update
        </Form.Submit>
        <Form.Reset className="btn btn-outline-primary" disabled={busy}>
          Reset
        </Form.Reset>
      </Form>
    </Card>
  );
}
