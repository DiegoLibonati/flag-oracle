import { render, screen } from "@testing-library/react";

import type { FlagProps } from "@/types/props";

import Flag from "@/components/Flag/Flag";

import { mockFlag } from "@tests/__mocks__/flags.mock";

interface RenderComponent {
  container: HTMLElement;
  props: FlagProps;
}

const renderComponent = (overrides?: Partial<FlagProps>): RenderComponent => {
  const props: FlagProps = {
    image: mockFlag.image,
    name: mockFlag.name,
    ...overrides,
  };
  const { container } = render(<Flag {...props} />);
  return { container, props };
};

describe("Flag", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render an img element", () => {
    renderComponent();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("should render the image with the correct src", () => {
    const { props } = renderComponent();
    expect(screen.getByRole("img")).toHaveAttribute("src", props.image);
  });

  it("should render the image with the correct alt text", () => {
    const { props } = renderComponent();
    expect(screen.getByRole("img", { name: props.name })).toBeInTheDocument();
  });

  it("should apply the flag CSS class", () => {
    const { container } = renderComponent();
    expect(container.querySelector<HTMLImageElement>("img.flag")).toBeInTheDocument();
  });
});
