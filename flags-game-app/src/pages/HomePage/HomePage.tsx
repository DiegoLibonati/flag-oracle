import { useEffect } from "react";
import { Link } from "react-router-dom";

import type { JSX } from "react";

import ListStats from "@/components/ListStats/ListStats";
import Loader from "@/components/Loader/Loader";

import { useUsersContext } from "@/hooks/useUsersContext";

import userService from "@/services/userService";

import "@/pages/HomePage/HomePage.css";

const HomePage = (): JSX.Element => {
  const {
    topUsers,
    handleStartFetchUsers,
    handleSetTopUsers,
    handleEndFetchUsers,
    handleSetErrorUsers,
    handleClearTopUsers,
  } = useUsersContext();

  const handleGetGeneralTopUsers = async (): Promise<void> => {
    try {
      handleStartFetchUsers();
      const response = await userService.getTopGeneral();
      handleSetTopUsers(response.data);
    } catch (error) {
      handleSetErrorUsers(String(error));
    } finally {
      handleEndFetchUsers();
    }
  };

  useEffect(() => {
    void handleGetGeneralTopUsers();

    return (): void => {
      handleClearTopUsers();
    };
  }, []);

  return (
    <main className="home-main">
      <section className="home-page">
        <article className="home-page__actions">
          <Link to="/menu" aria-label="Let's play – go to game modes" className="home-page__play">
            ¡Lets PLAY!
          </Link>
        </article>

        {topUsers.loading ? (
          <Loader></Loader>
        ) : (
          <ListStats nameTop={"GLOBAL TOP USERS"} arrayTop={topUsers.users}></ListStats>
        )}
      </section>
    </main>
  );
};

export default HomePage;
