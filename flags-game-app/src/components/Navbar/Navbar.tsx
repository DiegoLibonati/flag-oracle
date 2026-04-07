import { Link, NavLink } from "react-router-dom";

import type { JSX } from "react";

import Hamburger from "@/components/Hamburger/Hamburger";

import { useUiContext } from "@/hooks/useUiContext";

import "@/components/Navbar/Navbar.css";

const Navbar = (): JSX.Element => {
  const { navbar, handleManageNavbar } = useUiContext();

  return (
    <header className="header-wrapper">
      <div className="header__logo">
        <Link to="/" aria-label="FlagsGame – go to home page" className="header__title">
          FlagsGame
        </Link>

        <Hamburger navbar={navbar} manageNavbar={handleManageNavbar}></Hamburger>
      </div>

      <nav className={navbar ? "header__nav header__nav--open" : "header__nav"}>
        <ul className="header__nav-list">
          <li className="header__nav-list-item">
            <NavLink
              to="/"
              aria-label="Navigate to home page"
              className={({ isActive }) =>
                isActive ? "header__nav-link header__nav-link--active" : "header__nav-link"
              }
            >
              Home
            </NavLink>
          </li>
          <li className="header__nav-list-item">
            <NavLink
              to="/menu"
              aria-label="Navigate to menu page"
              className={({ isActive }) =>
                isActive ? "header__nav-link header__nav-link--active" : "header__nav-link"
              }
            >
              Menu
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
