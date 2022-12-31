import { expectTypeOf } from "expect-type";

import { AttributeSchema } from "./schema";
import { Type } from "./characteristics";

import { Attribute } from ".";

const schema: AttributeSchema = {
  name: "name",
  description: "",
  type: "string",
  multiValued: false,
  required: true,
  caseExact: true,
  canonicalValues: [],
  mutability: "readWrite",
  returned: "default",
  uniqueness: "none",
};

describe("Attribute", () => {
  test("Constructor", () => {
    // A valid schema should be creatable.
    expect(() => new Attribute(schema)).not.toThrow();
    // Invalid type characteristic should throw on runtime.
    expect(() => new Attribute({ ...schema, type: "yeet" as Type })).toThrow();
    // Type characteristic is not required.
    expect(
      () => new Attribute({ ...schema, type: undefined as unknown as Type }),
    ).not.toThrow();
    // Multi-valued characteristic is required.
    expect(
      () =>
        new Attribute({
          ...schema,
          multiValued: undefined as unknown as boolean,
        }),
    ).toThrow();
  });

  test("Validator - Simple String", () => {
    const attr = new Attribute({
      name: "name",
      description: "",
      type: "string",
      multiValued: false,
      required: true,
      caseExact: true,
      canonicalValues: [],
      mutability: "readWrite",
      returned: "default",
      uniqueness: "none",
    });

    expect(attr.validate("Hello world")).toStrictEqual("Hello world");
    expect(() => attr.validate(["Hello world"])).toThrow();
    expect(() => attr.validate(undefined)).toThrow();
    expect(() => attr.validate(42)).toThrow();

    expectTypeOf(attr.validate("work")).toEqualTypeOf<string>();
  });

  test("Validator - Case-Insensitive Canonical String List", () => {
    const attr = new Attribute({
      name: "name",
      description: "",
      type: "string",
      multiValued: true,
      required: true,
      caseExact: false,
      canonicalValues: ["home", "work"] as ["home", "work"],
      mutability: "readWrite",
      returned: "default",
      uniqueness: "none",
    });

    expect(attr.validate([])).toStrictEqual([]);
    expect(attr.validate(["work"])).toStrictEqual(["work"]);
    expect(attr.validate(["WORK"])).toStrictEqual(["work"]);
    expect(attr.validate(["home", "work"])).toStrictEqual(["home", "work"]);
    expect(attr.validate(["work", "work"])).toStrictEqual(["work", "work"]);
    expect(() => attr.validate(undefined)).toThrow();
    expect(() => attr.validate("work")).toThrow();
    expect(() => attr.validate([42])).toThrow();
    expect(() => attr.validate(["work", "school"])).toThrow();

    expectTypeOf(attr.validate(["work"])).toEqualTypeOf<("home" | "work")[]>();
  });

  test("Validator - Optional Integer", () => {
    const attr = new Attribute({
      name: "name",
      description: "",
      type: "integer",
      multiValued: false,
      required: false,
      caseExact: true,
      canonicalValues: [],
      mutability: "readWrite",
      returned: "default",
      uniqueness: "none",
    });

    expect(attr.validate(42)).toStrictEqual(42);
    expect(attr.validate(0)).toStrictEqual(0);
    expect(attr.validate(undefined)).toStrictEqual(undefined);
    expect(() => attr.validate(7 / 3)).toThrow();
    expect(() => attr.validate("42")).toThrow();
    expect(() => attr.validate([42])).toThrow();

    expectTypeOf(attr.validate(42)).toEqualTypeOf<number | undefined>();
  });
});
