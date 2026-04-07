import { render } from "@testing-library/react";

import Loader from "@/components/Loader/Loader";

interface RenderComponent {
  container: HTMLElement;
}

const renderComponent = (): RenderComponent => {
  const { container } = render(<Loader />);
  return { container };
};

describe("Loader", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the loader element", () => {
    const { container } = renderComponent();
    expect(container.querySelector<HTMLSpanElement>(".loader")).toBeInTheDocument();
  });
});
