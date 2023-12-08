import { render, screen } from "@testing-library/react";
import RepositoriesSummary from "./RepositoriesSummary";

test("display information about the repository", () => {
  const repository = {
    language: "javascript",
    stargazers_count: 1,
    open_issues: 2,
    forks: 3,
  };

  render(<RepositoriesSummary repository={repository} />);

  for (const key in repository) {
    const value = repository[key];

    const element = screen.getByText(new RegExp(value));

    expect(element).toBeInTheDocument();
  }
});
