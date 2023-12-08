import { rest } from "msw";
import { setupServer } from "msw/node";

export function createServer(handlerConfig) {
  const handlers = handlerConfig.map((handler) =>
    rest[handler.method || "get"](handler.url, (req, res, ctx) =>
      res(ctx.json(handler.res(req, res, ctx)))
    )
  );

  const server = setupServer(...handlers);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
