import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import Flag from "@/components/Flag/Flag";

const renderComponent = (
  image = "http://example.com/flag.png",
  name = "Test Country"
): RenderResult => {
  return render(<Flag image={image} name={name} />);
};

describe("Flag", () => {
  describe("rendering", () => {
    it("should render an image element", () => {
      renderComponent();
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("should set the src attribute to the image prop", () => {
      renderComponent("http://example.com/flag.png", "Test");
      expect(screen.getByRole("img")).toHaveAttribute("src", "http://example.com/flag.png");
    });

    it("should set the alt attribute to the name prop", () => {
      renderComponent("http://example.com/flag.png", "Colombia");
      expect(screen.getByAltText("Colombia")).toBeInTheDocument();
    });

    it("should have the 'flag' CSS class", () => {
      renderComponent();
      expect(screen.getByRole("img")).toHaveClass("flag");
    });

    it("should render with different image and name props", () => {
      renderComponent("http://other.com/img.png", "Argentina");
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "http://other.com/img.png");
      expect(img).toHaveAttribute("alt", "Argentina");
    });
  });
});
