import { Link, useParams } from "react-router-dom";
import { BsChevronLeft } from "react-icons/bs";

import type { JSX } from "react";

import "@/pages/StartGamePage/StartGamePage.css";

const StartGamePage = (): JSX.Element => {
  const { idMode } = useParams();

  return (
    <main className="start-game-main">
      <Link to={`/menu/${idMode}`} aria-label="Go back to mode details">
        <BsChevronLeft id="go-back" className="icon-go-back"></BsChevronLeft>
      </Link>

      <section className="start-game-page">
        <Link
          to={`/menu/${idMode}/game`}
          className="start-game-page__btn-start"
          aria-label="Start the game"
        >
          START GAME
        </Link>
      </section>
    </main>
  );
};

export default StartGamePage;
