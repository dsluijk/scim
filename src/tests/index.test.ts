import * as FileAttribute from "../attribute";
import * as FileSchema from "../schema";

import * as Index from "..";

describe("Exports", () => {
  test("Attribute", () => {
    expect(Index).toMatchObject(FileAttribute);
  });

  test("Schema", () => {
    expect(Index).toMatchObject(FileSchema);
  });
});
