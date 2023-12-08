import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { createServer } from "../../test/server";
import AuthButtons from "./AuthButtons";
import { SWRConfig } from "swr";

async function renderComponent() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );

  await screen.findAllByRole("link");
}

describe("when user is not signed in", () => {
  createServer([
    {
      method: "get",
      url: "/api/user",
      res: () => {
        return {
          user: null,
        };
      },
    },
  ]);

  test("sign in and sign up buttons are visible", async () => {
    await renderComponent();

    const signInButton = screen.getByRole("link", { name: "Sign In" });
    const signUpButton = screen.getByRole("link", { name: "Sign Up" });

    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("href", "/signin");

    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute("href", "/signup");
  });

  test("sign out is not visible", async () => {
    await renderComponent();

    const signOutButton = screen.queryByRole("link", { name: /sign out/i });

    expect(signOutButton).not.toBeInTheDocument();
  });
});

describe("when user is signed in", () => {
  createServer([
    {
      method: "get",
      url: "/api/user",
      res: () => {
        return {
          user: {
            id: 1,
            email: "test@test.com",
          },
        };
      },
    },
  ]);

  test("sign in and sign up buttons are not visible", async () => {
    await renderComponent();

    const signInButton = screen.queryByRole("link", { name: "Sign In" });
    const signUpButton = screen.queryByRole("link", { name: "Sign Up" });

    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });

  test("sign out is visible", async () => {
    await renderComponent();

    const signOutButton = screen.getByRole("link", { name: /sign out/i });

    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute("href", "/signout");
  });
});
