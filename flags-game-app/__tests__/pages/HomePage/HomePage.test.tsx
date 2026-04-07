import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { UserTop } from "@/types/app";

import HomePage from "@/pages/HomePage/HomePage";

import { useUsersContext } from "@/hooks/useUsersContext";

import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

interface RenderPage {
  container: HTMLElement;
}

const mockHandleStartFetchUsers = jest.fn();
const mockHandleSetTopUsers = jest.fn();
const mockHandleEndFetchUsers = jest.fn();
const mockHandleSetErrorUsers = jest.fn();
const mockHandleClearTopUsers = jest.fn();

jest.mock("@/hooks/useUsersContext");

const renderPage = (users: UserTop[] = [], loading = false): RenderPage => {
  (useUsersContext as jest.Mock).mockReturnValue({
    topUsers: { users, loading, error: null },
    handleStartFetchUsers: mockHandleStartFetchUsers,
    handleSetTopUsers: mockHandleSetTopUsers,
    handleEndFetchUsers: mockHandleEndFetchUsers,
    handleSetErrorUsers: mockHandleSetErrorUsers,
    handleClearTopUsers: mockHandleClearTopUsers,
  });

  const { container } = render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
  return { container };
};

describe("HomePage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the main element", () => {
    const { container } = renderPage();
    expect(container.querySelector<HTMLElement>("main.home-main")).toBeInTheDocument();
  });

  it("should render the play link", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /let's play/i })).toBeInTheDocument();
  });

  it("should show the Loader when users are loading", () => {
    const { container } = renderPage([], true);
    expect(container.querySelector<HTMLSpanElement>(".loader")).toBeInTheDocument();
  });

  it("should show ListStats when users are loaded", () => {
    renderPage(mockUsersTop as unknown as UserTop[]);
    expect(screen.getByText("GLOBAL TOP USERS")).toBeInTheDocument();
  });

  it("should call handleStartFetchUsers on mount", () => {
    renderPage();
    expect(mockHandleStartFetchUsers).toHaveBeenCalledTimes(1);
  });
});
