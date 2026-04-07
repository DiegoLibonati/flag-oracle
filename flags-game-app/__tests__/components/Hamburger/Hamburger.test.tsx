import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { HamburgerProps } from "@/types/props";

import Hamburger from "@/components/Hamburger/Hamburger";

interface RenderComponent {
  container: HTMLElement;
  props: HamburgerProps;
}

const mockManageNavbar = jest.fn();

const renderComponent = (overrides?: Partial<HamburgerProps>): RenderComponent => {
  const props: HamburgerProps = {
    navbar: false,
    manageNavbar: mockManageNavbar,
    ...overrides,
  };
  const { container } = render(<Hamburger {...props} />);
  return { container, props };
};

describe("Hamburger", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render a button element", () => {
    renderComponent();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it('should have aria-label "Open main menu" when navbar is closed', () => {
    renderComponent({ navbar: false });
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Open main menu");
  });

  it('should have aria-label "Close main menu" when navbar is open', () => {
    renderComponent({ navbar: true });
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Close main menu");
  });

  it("should have aria-expanded set to the navbar state", () => {
    renderComponent({ navbar: true });
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("should call manageNavbar when clicked", async () => {
    const user = userEvent.setup();
    renderComponent();
    await user.click(screen.getByRole("button"));
    expect(mockManageNavbar).toHaveBeenCalledTimes(1);
  });

  it("should apply the open class when navbar is true", () => {
    renderComponent({ navbar: true });
    expect(screen.getByRole("button")).toHaveClass("hamburger--open");
  });

  it("should not apply the open class when navbar is false", () => {
    renderComponent({ navbar: false });
    expect(screen.getByRole("button")).not.toHaveClass("hamburger--open");
  });
});
