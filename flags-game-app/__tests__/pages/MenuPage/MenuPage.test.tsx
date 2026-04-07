import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import type { Mode } from "@/types/app";

import MenuPage from "@/pages/MenuPage/MenuPage";

import { useModesContext } from "@/hooks/useModesContext";

import { mockModes } from "@tests/__mocks__/modes.mock";

interface RenderPage {
  container: HTMLElement;
}

const mockHandleStartFetchModes = jest.fn();
const mockHandleSetModes = jest.fn();
const mockHandleSetErrorModes = jest.fn();
const mockHandleEndFetchModes = jest.fn();
const mockHandleClearModes = jest.fn();

jest.mock("@/hooks/useModesContext");

const renderPage = (modes: Mode[] = [], loading = false): RenderPage => {
  (useModesContext as jest.Mock).mockReturnValue({
    modes: { modes, loading, error: null },
    handleStartFetchModes: mockHandleStartFetchModes,
    handleSetModes: mockHandleSetModes,
    handleSetErrorModes: mockHandleSetErrorModes,
    handleEndFetchModes: mockHandleEndFetchModes,
    handleClearModes: mockHandleClearModes,
  });

  const { container } = render(
    <MemoryRouter>
      <MenuPage />
    </MemoryRouter>
  );
  return { container };
};

describe("MenuPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show the Loader when modes are loading", () => {
    const { container } = renderPage([], true);
    expect(container.querySelector<HTMLSpanElement>(".loader")).toBeInTheDocument();
  });

  it("should render the main element when modes are loaded", () => {
    const { container } = renderPage(mockModes);
    expect(container.querySelector<HTMLElement>("main.menu-main")).toBeInTheDocument();
  });

  it("should render the back link to home", () => {
    renderPage(mockModes);
    expect(screen.getByRole("link", { name: /go back to home/i })).toBeInTheDocument();
  });

  it("should render a link for each game mode", () => {
    renderPage(mockModes);
    mockModes.forEach((mode) => {
      expect(
        screen.getByRole("link", { name: new RegExp(`play ${mode.name} mode`, "i") })
      ).toBeInTheDocument();
    });
  });

  it("should render the page title", () => {
    renderPage(mockModes);
    expect(screen.getByText(/choose a mode/i)).toBeInTheDocument();
  });

  it("should call handleStartFetchModes on mount", () => {
    renderPage();
    expect(mockHandleStartFetchModes).toHaveBeenCalledTimes(1);
  });
});
