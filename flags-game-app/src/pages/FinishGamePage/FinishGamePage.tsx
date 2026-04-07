import { useCallback, useEffect } from "react";

import type { JSX } from "react";

import FormRegisterUser from "@/components/Forms/FormRegisterUser/FormRegisterUser";
import FormUpdateUser from "@/components/Forms/FormUpdateUser/FormUpdateUser";

import { parseAlertType } from "@/helpers/parseAlertType";

import { useAlertContext } from "@/hooks/useAlertContext";
import { useGameContext } from "@/hooks/useGameContext";

import "@/pages/FinishGamePage/FinishGamePage.css";

// TODO: Separar estilos de alert // Componente Alert

const FinishGamePage = (): JSX.Element => {
  const { alert } = useAlertContext();
  const { handleSetScore } = useGameContext();

  const parseAlertTypeFn = useCallback(() => parseAlertType(alert.type), [alert.type]);

  useEffect(() => {
    return (): void => {
      handleSetScore(0);
    };
  }, []);

  return (
    <main className="finish-game-main">
      <section className="finish-game-page">
        <h4 role="alert" className={`alert ${parseAlertTypeFn()}`}>
          {alert.message}
        </h4>
        <article className="finish-game-page__wrapper-form finish-game-page__wrapper-register">
          <h2 className="finish-game-page__form-title">If you DONT have a user register</h2>

          <FormRegisterUser></FormRegisterUser>
        </article>

        <article className="finish-game-page__wrapper-form finish-game-page__wrapper-update">
          <h2 className="finish-game-page__form-title">If you HAVE a user register</h2>

          <FormUpdateUser></FormUpdateUser>
        </article>
      </section>
    </main>
  );
};

export default FinishGamePage;
