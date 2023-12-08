import { render, screen } from "@testing-library/react";
import RepositoriesListItem from "./RepositoriesListItem";
import { MemoryRouter } from "react-router";

// jest.mock("../tree/FileIcon", () => () => {
//   return <div>FileIcon</div>;
// });

function renderComoponent() {
  const repository = {
    full_name: "facebook/react",
    language: "javascript",
    description: "React makes it painless to create interactive UIs.",
    owner: { login: "facebook" },
    name: "react",
    html_url: "https://github.com/facebook/react",
  };

  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );

  return repository;
}

test("shows a link to the github homepage for the repository", async () => {
  const { html_url } = renderComoponent();

  await screen.findByRole("img", { name: "javascript" });

  const link = screen.getByRole("link", { name: /github repository/i });

  expect(link).toHaveAttribute("href", html_url);
});

test("shows a fileicon with the appropriate icon", async () => {
  renderComoponent();

  const icon = await screen.findByRole("img", { name: "javascript" });

  expect(icon).toHaveClass("js-icon");
});

test("shows a link to the code editor page", async () => {
  const { owner, full_name } = renderComoponent();

  await screen.findByRole("img", { name: "javascript" });

  const link = screen.getByRole("link", { name: new RegExp(owner.login, "i") });

  expect(link).toHaveAttribute("href", `/repositories/${full_name}`);
});
