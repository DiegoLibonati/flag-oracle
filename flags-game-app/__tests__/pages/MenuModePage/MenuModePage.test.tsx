import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import type { UserTop } from "@/types/app";

import MenuModePage from "@/pages/MenuModePage/MenuModePage";

import { useUsersContext } from "@/hooks/useUsersContext";
import { useModeContext } from "@/hooks/useModeContext";

import { mockMode } from "@tests/__mocks__/modes.mock";
import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

interface RenderPage {
  container: HTMLElement;
}

const mockHandleStartFetchUsers = jest.fn();
const mockHandleSetTopUsers = jest.fn();
const mockHandleEndFetchUsers = jest.fn();
const mockHandleSetErrorUsers = jest.fn();
const mockHandleClearTopUsers = jest.fn();
const mockHandleStartFetchMode = jest.fn();
const mockHandleSetMode = jest.fn();
const mockHandleEndFetchMode = jest.fn();
const mockHandleSetErrorMode = jest.fn();
const mockHandleClearMode = jest.fn();

jest.mock("@/hooks/useUsersContext");
jest.mock("@/hooks/useModeContext");

const renderPage = (loading = false): RenderPage => {
  (useUsersContext as jest.Mock).mockReturnValue({
    topUsers: { users: mockUsersTop as unknown as UserTop[], loading: false, error: null },
    handleStartFetchUsers: mockHandleStartFetchUsers,
    handleSetTopUsers: mockHandleSetTopUsers,
    handleEndFetchUsers: mockHandleEndFetchUsers,
    handleSetErrorUsers: mockHandleSetErrorUsers,
    handleClearTopUsers: mockHandleClearTopUsers,
  });

  (useModeContext as jest.Mock).mockReturnValue({
    mode: { mode: loading ? null : mockMode, loading, error: null },
    handleStartFetchMode: mockHandleStartFetchMode,
    handleSetMode: mockHandleSetMode,
    handleEndFetchMode: mockHandleEndFetchMode,
    handleSetErrorMode: mockHandleSetErrorMode,
    handleClearMode: mockHandleClearMode,
  });

  const { container } = render(
    <MemoryRouter initialEntries={[`/menu/${mockMode._id}`]}>
      <Routes>
        <Route path="/menu/:idMode" element={<MenuModePage />} />
      </Routes>
    </MemoryRouter>
  );
  return { container };
};

describe("MenuModePage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show the Loader when mode is loading", () => {
    const { container } = renderPage(true);
    expect(container.querySelector<HTMLSpanElement>(".loader")).toBeInTheDocument();
  });

  it("should render the mode title when loaded", () => {
    renderPage();
    expect(screen.getByText(new RegExp(`${mockMode.name} MODE`, "i"))).toBeInTheDocument();
  });

  it("should render the back link to menu", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /go back to menu/i })).toBeInTheDocument();
  });

  it("should render the play link", () => {
    renderPage();
    expect(
      screen.getByRole("link", { name: new RegExp(`play ${mockMode.name} mode`, "i") })
    ).toBeInTheDocument();
  });

  it("should render the mode description", () => {
    renderPage();
    expect(screen.getByText(mockMode.description)).toBeInTheDocument();
  });

  it("should render the top users list", () => {
    renderPage();
    expect(screen.getByText(new RegExp(`${mockMode.name} TOP USERS`, "i"))).toBeInTheDocument();
  });
});
