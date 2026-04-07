import { useEffect } from "react";
import { BsChevronLeft } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";

import type { JSX } from "react";

import ListStats from "@/components/ListStats/ListStats";
import Loader from "@/components/Loader/Loader";

import { useUsersContext } from "@/hooks/useUsersContext";
import { useModeContext } from "@/hooks/useModeContext";

import modeService from "@/services/modeService";

import "@/pages/MenuModePage/MenuModePage.css";

const MenuModePage = (): JSX.Element => {
  const { idMode } = useParams();

  const {
    topUsers,
    handleClearTopUsers,
    handleEndFetchUsers,
    handleSetErrorUsers,
    handleSetTopUsers,
    handleStartFetchUsers,
  } = useUsersContext();
  const {
    mode,
    handleClearMode,
    handleEndFetchMode,
    handleSetErrorMode,
    handleSetMode,
    handleStartFetchMode,
  } = useModeContext();

  const handleGetTopMode = async (): Promise<void> => {
    try {
      handleStartFetchUsers();
      const response = await modeService.getTopMode(idMode!);
      handleSetTopUsers(response.data);
    } catch (error) {
      handleSetErrorUsers(String(error));
    } finally {
      handleEndFetchUsers();
    }
  };

  const handleGetMode = async (): Promise<void> => {
    try {
      handleStartFetchMode();
      const response = await modeService.getById(idMode!);
      handleSetMode(response.data);
    } catch (error) {
      handleSetErrorMode(String(error));
    } finally {
      handleEndFetchMode();
    }
  };

  useEffect(() => {
    void handleGetTopMode();
    void handleGetMode();

    return (): void => {
      handleClearTopUsers();
      handleClearMode();
    };
  }, []);

  if (mode.loading) {
    return (
      <main className="menu-mode-main">
        <Loader></Loader>
      </main>
    );
  }

  return (
    <main className="menu-mode-main">
      <Link to="/menu" aria-label="Go back to menu">
        <BsChevronLeft id="go-back" className="icon-go-back"></BsChevronLeft>
      </Link>

      <section className="menu-mode-page">
        <h1 className="menu-mode-page__title">{mode.mode?.name} MODE</h1>

        <article className="menu-mode-page__explication">
          <p className="menu-mode-page__description">{mode.mode?.description}</p>

          <Link
            to={`/menu/${mode.mode?._id}/start`}
            aria-label={`Play ${mode.mode?.name} mode`}
            className="menu-mode-page__play"
          >
            ¡PLAY!
          </Link>
        </article>

        {topUsers.loading ? (
          <Loader></Loader>
        ) : (
          <ListStats
            nameTop={`${mode.mode?.name!.toUpperCase()} TOP USERS`}
            arrayTop={topUsers.users}
          ></ListStats>
        )}
      </section>
    </main>
  );
};

export default MenuModePage;
