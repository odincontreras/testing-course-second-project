import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeRoute from "./HomeRoute";
import { createServer } from "../test/server";

createServer([
  {
    method: "get",
    url: "/api/repositories",
    res: (req) => {
      const language = req.url.searchParams.get("q").split("language:")[1];

      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      };
    },
  },
]);

test("renders two links for each table", async () => {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );

  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];

  for (const language of languages) {
    const link = await screen.findAllByRole("link", {
      name: new RegExp(language + "_"),
    });

    expect(link).toHaveLength(2);

    expect(link[0]).toHaveTextContent(language + "_one");
    expect(link[1]).toHaveTextContent(language + "_two");

    expect(link[0]).toHaveAttribute(
      "href",
      "/repositories/" + language + "_one"
    );
    expect(link[1]).toHaveAttribute(
      "href",
      "/repositories/" + language + "_two"
    );
  }
});
