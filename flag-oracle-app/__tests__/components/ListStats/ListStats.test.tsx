import { render, screen } from "@testing-library/react";

import type { RenderResult } from "@testing-library/react";
import type { UserTop } from "@/types/app";

import ListStats from "@/components/ListStats/ListStats";

import { mockUsersTop } from "@tests/__mocks__/usersTop.mock";

const renderComponent = (nameTop: string, arrayTop: UserTop[]): RenderResult => {
  return render(<ListStats nameTop={nameTop} arrayTop={arrayTop} />);
};

describe("ListStats", () => {
  describe("rendering", () => {
    it("should render the title with the nameTop prop", () => {
      renderComponent("GLOBAL TOP USERS", []);
      expect(screen.getByRole("heading", { name: "GLOBAL TOP USERS" })).toBeInTheDocument();
    });

    it("should render a list element", () => {
      renderComponent("TOP", []);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should render a list item for each user", () => {
      renderComponent("TOP USERS", mockUsersTop);
      expect(screen.getAllByRole("listitem")).toHaveLength(mockUsersTop.length);
    });

    it("should render username and score for each user", () => {
      renderComponent("TOP USERS", mockUsersTop);
      expect(screen.getByText(/TITO with 6925 PTS/)).toBeInTheDocument();
    });

    it("should render all users from the array", () => {
      renderComponent("TOP USERS", mockUsersTop);
      expect(screen.getByText(/pipo with 6925 PTS/)).toBeInTheDocument();
      expect(screen.getByText(/carlos with 4240 PTS/)).toBeInTheDocument();
    });

    it("should render an empty list when arrayTop is empty", () => {
      renderComponent("TOP USERS", []);
      const list = screen.getByRole("list");
      expect(list.children).toHaveLength(0);
    });

    it("should render a different title when nameTop changes", () => {
      renderComponent("HARDCORE TOP USERS", mockUsersTop);
      expect(screen.getByRole("heading", { name: "HARDCORE TOP USERS" })).toBeInTheDocument();
    });
  });
});
