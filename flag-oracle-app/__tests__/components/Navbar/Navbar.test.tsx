import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import type { RenderResult } from "@testing-library/react";

import Navbar from "@/components/Navbar/Navbar";

import { UiProvider } from "@/contexts/UiContext/UiProvider";

const renderComponent = (): RenderResult => {
  return render(
    <MemoryRouter>
      <UiProvider>
        <Navbar />
      </UiProvider>
    </MemoryRouter>
  );
};

describe("Navbar", () => {
  describe("rendering", () => {
    it("should render the logo link with correct aria-label", () => {
      renderComponent();
      expect(
        screen.getByRole("link", { name: "Flag Oracle – go to home page" })
      ).toBeInTheDocument();
    });

    it("should render the Home nav link", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Navigate to home page" })).toBeInTheDocument();
    });

    it("should render the Menu nav link", () => {
      renderComponent();
      expect(screen.getByRole("link", { name: "Navigate to menu page" })).toBeInTheDocument();
    });

    it("should render the hamburger button in closed state", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: "Open main menu" })).toBeInTheDocument();
    });

    it("should not have nav--open class initially", () => {
      const { container } = renderComponent();
      const nav = container.querySelector<HTMLElement>("nav");
      expect(nav).not.toHaveClass("header__nav--open");
    });
  });

  describe("interaction", () => {
    it("should toggle hamburger to 'Close main menu' after click", async () => {
      renderComponent();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Open main menu" }));
      expect(screen.getByRole("button", { name: "Close main menu" })).toBeInTheDocument();
    });

    it("should add header__nav--open class to nav after hamburger click", async () => {
      const { container } = renderComponent();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Open main menu" }));
      const nav = container.querySelector<HTMLElement>("nav");
      expect(nav).toHaveClass("header__nav--open");
    });

    it("should close menu after second hamburger click", async () => {
      renderComponent();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Open main menu" }));
      await user.click(screen.getByRole("button", { name: "Close main menu" }));
      expect(screen.getByRole("button", { name: "Open main menu" })).toBeInTheDocument();
    });
  });
});
