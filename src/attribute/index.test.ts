import { expectTypeOf } from "expect-type";
import { StructError } from "superstruct";

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
  const baseSchema = {
    name: "name",
    description: "",
    type: "string",
    multiValued: false,
    required: false,
    caseExact: false,
    canonicalValues: [] as [],
    mutability: "readWrite",
    returned: "default",
    uniqueness: "none",
  } as const;

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

    expect(attr.validate(["work"])).toStrictEqual(["work"]);
    expect(attr.validate(["WORK"])).toStrictEqual(["work"]);
    expect(attr.validate(["home", "work"])).toStrictEqual(["home", "work"]);
    expect(attr.validate(["work", "work"])).toStrictEqual(["work", "work"]);
    expect(() => attr.validate(undefined)).toThrow();
    expect(() => attr.validate([])).toThrow();
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

  test("Untyped Validator", () => {
    expectTypeOf(
      new Attribute({
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
      } as object),
    ).toEqualTypeOf<Attribute<AttributeSchema>>();
  });

  test("Idempotency", () => {
    expect(() => new Attribute(baseSchema)).not.toThrow();
  });

  test("Defaults autofills", () => {
    expect(
      () =>
        new Attribute({
          ...baseSchema,
          type: undefined,
          description: undefined,
          required: undefined,
          canonicalValues: undefined,
          caseExact: undefined,
          mutability: undefined,
          returned: undefined,
          uniqueness: undefined,
        }),
    ).not.toThrow();
  });

  test("Invalid Schema Throws", () => {
    expect(() => new Attribute(undefined as unknown as object)).toThrow(
      StructError,
    );
    expect(() => new Attribute(42 as unknown as object)).toThrow(StructError);
    expect(() => new Attribute({ ...baseSchema, answer: 42 })).toThrow(
      StructError,
    );
  });

  test("Missing Required Throws", () => {
    expect(() => new Attribute({ ...baseSchema, name: undefined })).toThrow(
      StructError,
    );
    expect(
      () => new Attribute({ ...baseSchema, multiValued: undefined }),
    ).toThrow(StructError);
  });

  test("Subattributes cannot contain subattributes.", () => {
    expect(
      () =>
        new Attribute({
          ...baseSchema,
          type: "complex",
          subAttributes: [
            {
              ...baseSchema,
              type: "complex",
              subAttributes: [baseSchema],
            } as unknown as typeof baseSchema,
          ],
        }),
    ).toThrow(StructError);
  });

  test("Complex attributes require subattributes", () => {
    expect(() => new Attribute({ ...baseSchema, type: "complex" })).toThrow(
      StructError,
    );
    expect(
      () =>
        new Attribute({
          ...baseSchema,
          type: "complex",
          subAttributes: [],
        } as unknown as Partial<AttributeSchema>),
    ).toThrow(StructError);
    expect(
      () =>
        new Attribute({
          ...baseSchema,
          type: "complex",
          subAttributes: [baseSchema],
        }),
    ).not.toThrow();
  });
});
