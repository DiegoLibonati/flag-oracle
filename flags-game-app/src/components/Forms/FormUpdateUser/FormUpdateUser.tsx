import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { JSX } from "react";

import { useForm } from "@/hooks/useForm";
import { useGameContext } from "@/hooks/useGameContext";
import { useAlertContext } from "@/hooks/useAlertContext";

import userService from "@/services/userService";

import "@/components/Forms/FormUpdateUser/FormUpdateUser.css";

const FormUpdateUser = (): JSX.Element => {
  const redirectTimeoutRef = useRef<number | null>(null);

  const { idMode } = useParams();
  const navigate = useNavigate();

  const { score } = useGameContext();
  const { alert, handleSetAlert } = useAlertContext();

  const { formState, onInputChange, onResetForm } = useForm({
    username: "",
    password: "",
  });

  const onSendRequest = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    try {
      e.preventDefault();

      const body = {
        username: formState.username,
        password: formState.password,
        score: score,
        mode_id: idMode!,
      };

      const result = await userService.updateByUsername(body);

      const { message } = result;

      handleSetAlert({ type: "alert-auth-success", message: message });
      onResetForm();

      redirectTimeoutRef.current = setTimeout(() => {
        void navigate("/");
      }, 2000);
    } catch (e) {
      handleSetAlert({
        type: "alert-auth-error",
        message: String(e),
      });
      onResetForm();
    }
  };

  useEffect(() => {
    return (): void => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  return (
    <form
      className="form-update-user"
      onSubmit={(e) => {
        void onSendRequest(e);
      }}
    >
      <h3 className="form-update-user__score">Your score was: {score} PTS</h3>
      <input
        type="text"
        placeholder="Your username goes here"
        aria-label="Username"
        value={formState.username}
        name="username"
        className="form-update-user__input"
        onChange={(e) => {
          onInputChange(e);
        }}
      ></input>
      <input
        type="password"
        placeholder="Your password goes here"
        aria-label="Password"
        value={formState.password}
        name="password"
        className="form-update-user__input"
        onChange={(e) => {
          onInputChange(e);
        }}
      ></input>
      <button
        type="submit"
        aria-label="Update existing user"
        className="form-update-user__submit"
        disabled={alert.type === "alert-auth-error" || alert.type === "alert-auth-success"}
      >
        Send and replace
      </button>
    </form>
  );
};

export default FormUpdateUser;
