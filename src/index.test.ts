import { expectTypeOf } from "expect-type";

import { ping } from "./index";

test("Dummy unit test", async () => {
  const status = await ping();
  expect(status).toBe(200);
});

test("Dummy unit test test", async () => {
  expectTypeOf(ping).returns.resolves.toBeNumber();
});
