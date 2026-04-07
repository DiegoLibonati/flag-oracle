import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Navbar from "@/components/Navbar/Navbar";

import { useUiContext } from "@/hooks/useUiContext";

interface RenderComponent {
  container: HTMLElement;
}

const mockHandleManageNavbar = jest.fn();

jest.mock("@/hooks/useUiContext");

const renderComponent = (navbar = false): RenderComponent => {
  (useUiContext as jest.Mock).mockReturnValue({
    navbar,
    handleManageNavbar: mockHandleManageNavbar,
  });
  const { container } = render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
  return { container };
};

describe("Navbar", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the header element", () => {
    const { container } = renderComponent();
    expect(container.querySelector<HTMLElement>("header.header-wrapper")).toBeInTheDocument();
  });

  it("should render the FlagsGame logo link", () => {
    renderComponent();
    expect(screen.getByRole("link", { name: /flagsgame/i })).toBeInTheDocument();
  });

  it("should render the Home nav link", () => {
    renderComponent();
    expect(screen.getByRole("link", { name: /navigate to home page/i })).toBeInTheDocument();
  });

  it("should render the Menu nav link", () => {
    renderComponent();
    expect(screen.getByRole("link", { name: /navigate to menu page/i })).toBeInTheDocument();
  });

  it("should render the hamburger button", () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /main menu/i })).toBeInTheDocument();
  });

  it("should open the nav when hamburger is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button", { name: /main menu/i }));
    expect(mockHandleManageNavbar).toHaveBeenCalledTimes(1);
  });

  it("should apply the open class to nav when navbar is true", () => {
    const { container } = renderComponent(true);
    expect(container.querySelector<HTMLElement>(".header__nav--open")).toBeInTheDocument();
  });
});
