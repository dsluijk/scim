import * as FileAttribute from "./attribute";

import * as IndexAttribute from ".";

describe("Exports", () => {
  test("Attribute", () => {
    expect(IndexAttribute).toStrictEqual(FileAttribute);
  });
});
