import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";

import Hamburger from "@/components/Hamburger/Hamburger";

const renderComponent = (navbar: boolean, manageNavbar = jest.fn()): RenderResult => {
  return render(<Hamburger navbar={navbar} manageNavbar={manageNavbar} />);
};

describe("Hamburger", () => {
  describe("rendering when closed", () => {
    it("should render a button", () => {
      renderComponent(false);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should have aria-label 'Open main menu' when navbar is false", () => {
      renderComponent(false);
      expect(screen.getByRole("button", { name: "Open main menu" })).toBeInTheDocument();
    });

    it("should have aria-expanded false when closed", () => {
      renderComponent(false);
      expect(screen.getByRole("button", { name: "Open main menu" })).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("should not have hamburger--open class when closed", () => {
      renderComponent(false);
      expect(screen.getByRole("button")).not.toHaveClass("hamburger--open");
    });

    it("should have hamburger class", () => {
      renderComponent(false);
      expect(screen.getByRole("button")).toHaveClass("hamburger");
    });
  });

  describe("rendering when open", () => {
    it("should have aria-label 'Close main menu' when navbar is true", () => {
      renderComponent(true);
      expect(screen.getByRole("button", { name: "Close main menu" })).toBeInTheDocument();
    });

    it("should have aria-expanded true when open", () => {
      renderComponent(true);
      expect(screen.getByRole("button", { name: "Close main menu" })).toHaveAttribute(
        "aria-expanded",
        "true"
      );
    });

    it("should have hamburger--open class when open", () => {
      renderComponent(true);
      expect(screen.getByRole("button")).toHaveClass("hamburger--open");
    });
  });

  describe("interaction", () => {
    it("should call manageNavbar when clicked", async () => {
      const manageNavbar = jest.fn();
      renderComponent(false, manageNavbar);
      const user = userEvent.setup();
      await user.click(screen.getByRole("button"));
      expect(manageNavbar).toHaveBeenCalledTimes(1);
    });

    it("should call manageNavbar exactly once per click", async () => {
      const manageNavbar = jest.fn();
      renderComponent(true, manageNavbar);
      const user = userEvent.setup();
      await user.click(screen.getByRole("button"));
      expect(manageNavbar).toHaveBeenCalledTimes(1);
    });
  });
});
