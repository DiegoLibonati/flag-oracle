import { render } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";

import Loader from "@/components/Loader/Loader";

const renderComponent = (): RenderResult => render(<Loader />);

describe("Loader", () => {
  describe("rendering", () => {
    it("should render a span element", () => {
      const { container } = renderComponent();
      expect(container.querySelector<HTMLSpanElement>("span")).toBeInTheDocument();
    });

    it("should have the 'loader' CSS class", () => {
      const { container } = renderComponent();
      const span = container.querySelector<HTMLSpanElement>("span");
      expect(span).toHaveClass("loader");
    });

    it("should render only one element", () => {
      const { container } = renderComponent();
      expect(container.children).toHaveLength(1);
    });
  });
});
