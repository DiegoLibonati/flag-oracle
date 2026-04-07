import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import StartGamePage from "@/pages/StartGamePage/StartGamePage";

import { mockMode } from "@tests/__mocks__/modes.mock";

interface RenderPage {
  container: HTMLElement;
}

const renderPage = (): RenderPage => {
  const { container } = render(
    <MemoryRouter initialEntries={[`/menu/${mockMode._id}/start`]}>
      <Routes>
        <Route path="/menu/:idMode/start" element={<StartGamePage />} />
      </Routes>
    </MemoryRouter>
  );
  return { container };
};

describe("StartGamePage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the main element", () => {
    const { container } = renderPage();
    expect(container.querySelector<HTMLElement>("main.start-game-main")).toBeInTheDocument();
  });

  it("should render the start game link", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /start the game/i })).toBeInTheDocument();
  });

  it("should render the back link", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /go back to mode details/i })).toBeInTheDocument();
  });

  it("should point the start link to the game route", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /start the game/i })).toHaveAttribute(
      "href",
      `/menu/${mockMode._id}/game`
    );
  });

  it("should point the back link to the mode page", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /go back to mode details/i })).toHaveAttribute(
      "href",
      `/menu/${mockMode._id}`
    );
  });
});
