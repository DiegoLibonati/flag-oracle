import { render, screen } from "@testing-library/react";

import type { UserTop } from "@/types/app";
import type { ListStatsProps } from "@/types/props";

import ListStats from "@/components/ListStats/ListStats";

import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

interface RenderComponent {
  container: HTMLElement;
  props: ListStatsProps;
}

const renderComponent = (overrides?: Partial<ListStatsProps>): RenderComponent => {
  const props: ListStatsProps = {
    nameTop: "GLOBAL TOP USERS",
    arrayTop: mockUsersTop as unknown as UserTop[],
    ...overrides,
  };
  const { container } = render(<ListStats {...props} />);
  return { container, props };
};

describe("ListStats", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the title", () => {
    renderComponent();
    expect(screen.getByText("GLOBAL TOP USERS")).toBeInTheDocument();
  });

  it("should render all users in the list", () => {
    renderComponent();
    expect(screen.getAllByRole("listitem")).toHaveLength(mockUsersTop.length);
  });

  it("should display each username with their score", () => {
    renderComponent();
    expect(screen.getByText(/TITO with 6925 PTS/i)).toBeInTheDocument();
    expect(screen.getByText(/pipo with 6925 PTS/i)).toBeInTheDocument();
  });

  it("should render an empty list when arrayTop is empty", () => {
    renderComponent({ arrayTop: [] });
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("should render the custom title passed as prop", () => {
    renderComponent({ nameTop: "HARDCORE TOP USERS" });
    expect(screen.getByText("HARDCORE TOP USERS")).toBeInTheDocument();
  });
});
