import * as AttributeFile from "./attribute";

import * as Index from ".";

describe("Exports", () => {
  test("Attribute", () => {
    expect(Index).toMatchObject(AttributeFile);
  });
});
