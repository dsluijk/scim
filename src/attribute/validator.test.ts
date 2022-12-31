import { create, Describe, StructError } from "superstruct";
import { expectTypeOf } from "expect-type";

import { AttributeValidator, attributeValidator } from "./validator";
import { AttributeSchema } from "./schema";

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

test("Types Validator", () => {
  expect(
    create("str", attributeValidator({ ...schema, type: "string" })),
  ).toStrictEqual("str");
  expect(() =>
    create(42, attributeValidator({ ...schema, type: "string" })),
  ).toThrow(StructError);

  expect(
    create(true, attributeValidator({ ...schema, type: "boolean" })),
  ).toStrictEqual(true);
  expect(() =>
    create("true", attributeValidator({ ...schema, type: "boolean" })),
  ).toThrow(StructError);

  expect(
    create(1.5, attributeValidator({ ...schema, type: "decimal" })),
  ).toStrictEqual(1.5);
  expect(
    create(42, attributeValidator({ ...schema, type: "decimal" })),
  ).toStrictEqual(42);
  expect(() =>
    create("42", attributeValidator({ ...schema, type: "decimal" })),
  ).toThrow(StructError);

  expect(
    create(42, attributeValidator({ ...schema, type: "integer" })),
  ).toStrictEqual(42);
  expect(() =>
    create(1.5, attributeValidator({ ...schema, type: "integer" })),
  ).toThrow(StructError);
  expect(() =>
    create("42", attributeValidator({ ...schema, type: "integer" })),
  ).toThrow(StructError);

  const date =
    "Thu Jan 01 2000 12:00:00 GMT+0100 (Central European Standard Time)";
  expect(
    create(date, attributeValidator({ ...schema, type: "dateTime" })),
  ).toStrictEqual(new Date(date));
  expect(
    create(new Date(date), attributeValidator({ ...schema, type: "dateTime" })),
  ).toStrictEqual(new Date(date));
  expect(() =>
    create("now", attributeValidator({ ...schema, type: "dateTime" })),
  ).toThrow(StructError);

  expect(
    create(
      "SGVsbG8gV29ybGQh",
      attributeValidator({ ...schema, type: "binary" }),
    ),
  ).toStrictEqual(
    new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
  );
  expect(
    create(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
      attributeValidator({ ...schema, type: "binary" }),
    ),
  ).toStrictEqual(
    new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
  );
  expect(() =>
    create(12, attributeValidator({ ...schema, type: "binary" })),
  ).toThrow(StructError);

  expect(
    create("TODO", attributeValidator({ ...schema, type: "reference" })),
  ).toStrictEqual("TODO");

  expect(
    create("TODO", attributeValidator({ ...schema, type: "complex" })),
  ).toStrictEqual("TODO");
});

describe("String Schema Validator", () => {
  test("Simple", () => {
    const validator = attributeValidator(schema);

    expect(create("Mario", validator)).toStrictEqual("Mario");
    expect(() => create(["Mario", "Luigi"], validator)).toThrow(StructError);
    expect(() => create(42, validator)).toThrow(StructError);
  });

  test("Case Non-exact", () => {
    const validator = attributeValidator({ ...schema, caseExact: false });

    expect(create("Mario", validator)).toStrictEqual("mario");
    expect(() => create(["Mario", "Luigi"], validator)).toThrow(StructError);
    expect(() => create(42, validator)).toThrow(StructError);
  });

  test("Required", () => {
    const validator = attributeValidator({ ...schema });

    expect(create("Mario", validator)).toStrictEqual("Mario");
    expect(() => create(undefined, validator)).toThrow(StructError);

    const validator2 = attributeValidator({ ...schema, required: false });

    expect(create("Mario", validator2)).toStrictEqual("Mario");
    expect(create(undefined, validator2)).toStrictEqual(undefined);
  });

  test("Multi-valued", () => {
    const validator = attributeValidator({ ...schema, multiValued: true });

    expect(create(["Mario", "Luigi"], validator)).toStrictEqual([
      "Mario",
      "Luigi",
    ]);
    expect(() => create("Mario", validator)).toThrow(StructError);
    expect(() => create(42, validator)).toThrow(StructError);
  });

  test("Canonical", () => {
    const validator = attributeValidator({
      ...schema,
      canonicalValues: ["Mario", "Luigi"],
    });

    expect(create("Mario", validator)).toStrictEqual("Mario");
    expect(create("Luigi", validator)).toStrictEqual("Luigi");
    expect(() => create("Toad", validator)).toThrow(StructError);
    expect(() => create(["Mario", "Luigi"], validator)).toThrow(StructError);
    expect(() => create(42, validator)).toThrow(StructError);
  });

  test("Multi-valued Canonical", () => {
    const validator = attributeValidator({
      ...schema,
      multiValued: true,
      canonicalValues: ["Mario", "Luigi"],
    });

    expect(create(["Mario", "Luigi"], validator)).toStrictEqual([
      "Mario",
      "Luigi",
    ]);
    expect(() => create(["Mario", "Luigi", "Toad"], validator)).toThrow(
      StructError,
    );
    expect(() => create("Mario", validator)).toThrow(StructError);
    expect(() => create(42, validator)).toThrow(StructError);
  });
});

describe("Number Schema Validator", () => {
  test("Simple Decimal", () => {
    const validator = attributeValidator({ ...schema, type: "decimal" });

    expect(create(42, validator)).toStrictEqual(42);
    expect(create(42.5, validator)).toStrictEqual(42.5);
    expect(create(7 / 3, validator)).toStrictEqual(7 / 3);
    expect(() => create("Mario", validator)).toThrow(StructError);
    expect(() => create([42, 69], validator)).toThrow(StructError);
  });

  test("Simple Integer", () => {
    const validator = attributeValidator({ ...schema, type: "integer" });

    expect(create(42, validator)).toStrictEqual(42);
    expect(() => create(7 / 3, validator)).toThrow(StructError);
    expect(() => create(42.5, validator)).toThrow(StructError);
    expect(() => create("Mario", validator)).toThrow(StructError);
    expect(() => create([42, 69], validator)).toThrow(StructError);
  });

  test("Multi-valued", () => {
    const validator = attributeValidator({
      ...schema,
      type: "decimal",
      multiValued: true,
    });

    expect(create([1, 2, 3], validator)).toStrictEqual([1, 2, 3]);
    expect(() => create(42, validator)).toThrow(StructError);
    expect(() => create("Mario", validator)).toThrow(StructError);
  });

  test("Required", () => {
    const validator = attributeValidator({ ...schema, type: "decimal" });

    expect(create(42, validator)).toStrictEqual(42);
    expect(() => create(undefined, validator)).toThrow(StructError);

    const validator2 = attributeValidator({
      ...schema,
      type: "decimal",
      required: false,
    });

    expect(create(42, validator2)).toStrictEqual(42);
    expect(create(undefined, validator2)).toStrictEqual(undefined);
  });
});

describe("Binary Schema Validator", () => {
  test("Simple Binary", () => {
    const validator = attributeValidator({ ...schema, type: "binary" });

    expect(create("", validator)).toStrictEqual(new Uint8Array(0));
    expect(create("SGVsbG8gV29ybGQh", validator)).toStrictEqual(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
    );
    expect(() => create("Mario", validator)).toThrow(StructError);
    expect(() => create([42, 69], validator)).toThrow(StructError);
  });

  test("Multi-valued", () => {
    const validator = attributeValidator({
      ...schema,
      type: "binary",
      multiValued: true,
    });

    expect(create([], validator)).toStrictEqual([]);
    expect(create(["", ""], validator)).toStrictEqual([
      new Uint8Array(0),
      new Uint8Array(0),
    ]);
    expect(() => create("", validator)).toThrow(StructError);
    expect(() => create("SGVsbG8gV29ybGQh", validator)).toThrow(StructError);
  });

  test("Required", () => {
    const validator = attributeValidator({ ...schema, type: "binary" });

    expect(create("", validator)).toStrictEqual(new Uint8Array(0));
    expect(() => create(undefined, validator)).toThrow(StructError);

    const validator2 = attributeValidator({
      ...schema,
      type: "binary",
      required: false,
    });

    expect(create("", validator2)).toStrictEqual(new Uint8Array(0));
    expect(create(undefined, validator2)).toStrictEqual(undefined);
  });
});

test("Attribute Validator", () => {
  type IsAdmin = AttributeSchema<"isAdmin", "string", false, false, []>;
  type Tags = AttributeSchema<"tags", "string", true, true, ["work", "home"]>;
  type CreatedAt = AttributeSchema<"createdAt", "dateTime", false, true, []>;
  type Blobs = AttributeSchema<"blobs", "binary", true, false, []>;

  expectTypeOf(attributeValidator<IsAdmin>).returns.toEqualTypeOf<
    AttributeValidator<IsAdmin>
  >();
  expectTypeOf(attributeValidator<Tags>).returns.toEqualTypeOf<
    AttributeValidator<Tags>
  >();
  expectTypeOf(attributeValidator<CreatedAt>).returns.toEqualTypeOf<
    AttributeValidator<CreatedAt>
  >();
  expectTypeOf(attributeValidator<Blobs>).returns.toEqualTypeOf<
    AttributeValidator<Blobs>
  >();
});

test("Attribute Validator Type", () => {
  type IsAdmin = AttributeSchema<"isAdmin", "string", false, false, []>;
  type Tags = AttributeSchema<"tags", "string", true, true, ["work", "home"]>;
  type CreatedAt = AttributeSchema<"createdAt", "dateTime", false, true, []>;
  type Blobs = AttributeSchema<"blobs", "binary", true, false, []>;

  expectTypeOf(attributeValidator<IsAdmin>).returns.toEqualTypeOf<
    AttributeValidator<IsAdmin>
  >();
  expectTypeOf(attributeValidator<Tags>).returns.toEqualTypeOf<
    AttributeValidator<Tags>
  >();
  expectTypeOf(attributeValidator<CreatedAt>).returns.toEqualTypeOf<
    AttributeValidator<CreatedAt>
  >();
  expectTypeOf(attributeValidator<Blobs>).returns.toEqualTypeOf<
    AttributeValidator<Blobs>
  >();

  expectTypeOf<AttributeValidator<IsAdmin>>().toEqualTypeOf<
    Describe<string | undefined>
  >();
  expectTypeOf<AttributeValidator<Tags>>().toEqualTypeOf<
    Describe<("work" | "home")[]>
  >();
  expectTypeOf<AttributeValidator<CreatedAt>>().toEqualTypeOf<Describe<Date>>();
  expectTypeOf<AttributeValidator<Blobs>>().toEqualTypeOf<
    Describe<Uint8Array[] | undefined>
  >();
});
