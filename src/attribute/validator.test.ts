import { create, Describe, literal, string, StructError } from "superstruct";
import { expectTypeOf } from "expect-type";

import { AttributeSchema } from "./schema";
import { createAttributeValidator } from "./validator";

import { AttributeType } from ".";

const schema = {
  name: "name",
  description: "",
  type: "string",
  multiValued: false,
  required: true,
  caseExact: true,
  canonicalValues: [] as [],
  mutability: "readWrite",
  returned: "default",
  uniqueness: "none",
} as const;

test("Types Validator", () => {
  expect(
    create("str", createAttributeValidator({ ...schema, type: "string" })),
  ).toStrictEqual("str");
  expect(() =>
    create(42, createAttributeValidator({ ...schema, type: "string" })),
  ).toThrow(StructError);

  expect(
    create(true, createAttributeValidator({ ...schema, type: "boolean" })),
  ).toStrictEqual(true);
  expect(() =>
    create("true", createAttributeValidator({ ...schema, type: "boolean" })),
  ).toThrow(StructError);

  expect(
    create(1.5, createAttributeValidator({ ...schema, type: "decimal" })),
  ).toStrictEqual(1.5);
  expect(
    create(42, createAttributeValidator({ ...schema, type: "decimal" })),
  ).toStrictEqual(42);
  expect(() =>
    create("42", createAttributeValidator({ ...schema, type: "decimal" })),
  ).toThrow(StructError);

  expect(
    create(42, createAttributeValidator({ ...schema, type: "integer" })),
  ).toStrictEqual(42);
  expect(() =>
    create(1.5, createAttributeValidator({ ...schema, type: "integer" })),
  ).toThrow(StructError);
  expect(() =>
    create("42", createAttributeValidator({ ...schema, type: "integer" })),
  ).toThrow(StructError);

  const date =
    "Thu Jan 01 2000 12:00:00 GMT+0100 (Central European Standard Time)";
  expect(
    create(date, createAttributeValidator({ ...schema, type: "dateTime" })),
  ).toStrictEqual(new Date(date));
  expect(
    create(
      new Date(date),
      createAttributeValidator({ ...schema, type: "dateTime" }),
    ),
  ).toStrictEqual(new Date(date));
  expect(() =>
    create("now", createAttributeValidator({ ...schema, type: "dateTime" })),
  ).toThrow(StructError);

  expect(
    create(
      "SGVsbG8gV29ybGQh",
      createAttributeValidator({ ...schema, type: "binary" }),
    ),
  ).toStrictEqual(
    new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
  );
  expect(
    create(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
      createAttributeValidator({ ...schema, type: "binary" }),
    ),
  ).toStrictEqual(
    new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
  );
  expect(() =>
    create(12, createAttributeValidator({ ...schema, type: "binary" })),
  ).toThrow(StructError);

  expect(
    create(
      "urn:ietf:params:scim:schemas:core:2.0:Group",
      createAttributeValidator({
        ...schema,
        type: "reference",
        referenceTypes: ["uri"],
      }),
    ),
  ).toStrictEqual("urn:ietf:params:scim:schemas:core:2.0:Group");
  expect(() =>
    create(
      "notvalid",
      createAttributeValidator({
        ...schema,
        type: "reference",
        referenceTypes: ["uri"],
      }),
    ),
  ).toThrow(StructError);
  expect(
    create(
      "https://example.com/test.png",
      createAttributeValidator({
        ...schema,
        type: "reference",
        referenceTypes: ["external"],
      }),
    ),
  ).toStrictEqual("https://example.com/test.png");
  expect(() =>
    create(
      "urn:ietf:params:scim:schemas:core:2.0:Group",
      createAttributeValidator({
        ...schema,
        type: "reference",
        referenceTypes: ["external"],
      }),
    ),
  ).toThrow(StructError);
  expect(
    create(
      "urn:ietf:params:scim:schemas:core:2.0:Group",
      createAttributeValidator({
        ...schema,
        type: "reference",
        referenceTypes: ["uri", "external"],
      }),
    ),
  ).toStrictEqual("urn:ietf:params:scim:schemas:core:2.0:Group");
  expect(
    create(
      "https://example.com/test.png",
      createAttributeValidator({
        ...schema,
        type: "reference",
        referenceTypes: ["uri", "external"],
      }),
    ),
  ).toStrictEqual("https://example.com/test.png");
  expect(
    create(
      "acceptsanystring",
      createAttributeValidator({
        ...schema,
        type: "reference",
        referenceTypes: ["other"],
      }),
    ),
  ).toStrictEqual("acceptsanystring");

  expect(
    create(
      { name: "Mario" },
      createAttributeValidator({
        ...schema,
        type: "complex",
        subAttributes: [schema],
      }),
    ),
  ).toStrictEqual({ name: "Mario" });
  expect(
    create(
      { second: "Mario" },
      createAttributeValidator({
        ...schema,
        type: "complex",
        subAttributes: [{ ...schema, name: "second" }],
      }),
    ),
  ).toStrictEqual({ second: "Mario" });
  expect(() =>
    create(
      12,
      createAttributeValidator({
        ...schema,
        type: "complex",
        subAttributes: [schema],
      }),
    ),
  ).toThrow(StructError);
  expect(() =>
    create(
      { name: "Mario", second: 42 },
      createAttributeValidator({
        ...schema,
        type: "complex",
        subAttributes: [schema],
      }),
    ),
  ).toThrow(StructError);
  expect(() =>
    create(
      {},
      createAttributeValidator({
        ...schema,
        type: "complex",
        subAttributes: [schema],
      }),
    ),
  ).toThrow(StructError);
});

describe("String Schema Validator", () => {
  test("Simple", () => {
    const validator = createAttributeValidator(schema);

    expect(create("Mario", validator)).toStrictEqual("Mario");
    expect(() => create(["Mario", "Luigi"], validator)).toThrow(StructError);
    expect(() => create(42, validator)).toThrow(StructError);
  });

  test("Case Non-exact", () => {
    const validator = createAttributeValidator({ ...schema, caseExact: false });

    expect(create("Mario", validator)).toStrictEqual("mario");
    expect(() => create(["Mario", "Luigi"], validator)).toThrow(StructError);
    expect(() => create(42, validator)).toThrow(StructError);
  });

  test("Required", () => {
    const validator = createAttributeValidator({ ...schema });

    expect(create("Mario", validator)).toStrictEqual("Mario");
    expect(() => create(undefined, validator)).toThrow(StructError);

    const validator2 = createAttributeValidator({ ...schema, required: false });

    expect(create("Mario", validator2)).toStrictEqual("Mario");
    expect(create(undefined, validator2)).toStrictEqual(undefined);
  });

  test("Multi-valued", () => {
    const validator = createAttributeValidator({
      ...schema,
      multiValued: true,
    });

    expect(create(["Mario", "Luigi"], validator)).toStrictEqual([
      "Mario",
      "Luigi",
    ]);
    expect(() => create("Mario", validator)).toThrow(StructError);
    expect(() => create(42, validator)).toThrow(StructError);
  });

  test("Canonical", () => {
    const validator = createAttributeValidator({
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
    const validator = createAttributeValidator({
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
    const validator = createAttributeValidator({ ...schema, type: "decimal" });

    expect(create(42, validator)).toStrictEqual(42);
    expect(create(42.5, validator)).toStrictEqual(42.5);
    expect(create(7 / 3, validator)).toStrictEqual(7 / 3);
    expect(() => create("Mario", validator)).toThrow(StructError);
    expect(() => create([42, 69], validator)).toThrow(StructError);
  });

  test("Simple Integer", () => {
    const validator = createAttributeValidator({ ...schema, type: "integer" });

    expect(create(42, validator)).toStrictEqual(42);
    expect(() => create(7 / 3, validator)).toThrow(StructError);
    expect(() => create(42.5, validator)).toThrow(StructError);
    expect(() => create("Mario", validator)).toThrow(StructError);
    expect(() => create([42, 69], validator)).toThrow(StructError);
  });

  test("Multi-valued", () => {
    const validator = createAttributeValidator({
      ...schema,
      type: "decimal",
      multiValued: true,
    });

    expect(create([1, 2, 3], validator)).toStrictEqual([1, 2, 3]);
    expect(() => create(42, validator)).toThrow(StructError);
    expect(() => create("Mario", validator)).toThrow(StructError);
  });

  test("Required", () => {
    const validator = createAttributeValidator({ ...schema, type: "decimal" });

    expect(create(42, validator)).toStrictEqual(42);
    expect(() => create(undefined, validator)).toThrow(StructError);

    const validator2 = createAttributeValidator({
      ...schema,
      type: "decimal",
      required: false,
    });

    expect(create(42, validator2)).toStrictEqual(42);
    expect(create(undefined, validator2)).toStrictEqual(undefined);
  });
});

describe("Extra Validator", () => {
  test("No-op extra passes", () => {
    expect(
      create("Hello World", createAttributeValidator(schema)),
    ).toStrictEqual("Hello World");
    expect(
      create("Hello World", createAttributeValidator(schema, string())),
    ).toStrictEqual("Hello World");
    expect(
      create(
        "Hello World",
        createAttributeValidator(schema, literal("Hello World")),
      ),
    ).toStrictEqual("Hello World");
  });

  test("Extra validation is fail-able", () => {
    expect(
      create(
        "Hello World",
        createAttributeValidator(schema, literal("Hello World")),
      ),
    ).toStrictEqual("Hello World");
    expect(() =>
      create(
        "Hello World",
        createAttributeValidator(schema, literal("Hello Boo")),
      ),
    ).toThrow(StructError);
  });
});

describe("Binary Schema Validator", () => {
  test("Simple Binary", () => {
    const validator = createAttributeValidator({ ...schema, type: "binary" });

    expect(create("", validator)).toStrictEqual(new Uint8Array(0));
    expect(create("SGVsbG8gV29ybGQh", validator)).toStrictEqual(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
    );
    expect(() => create("Mario", validator)).toThrow(StructError);
    expect(() => create([42, 69], validator)).toThrow(StructError);
  });

  test("Multi-valued", () => {
    const validator = createAttributeValidator({
      ...schema,
      type: "binary",
      multiValued: true,
      required: false,
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
    const validator = createAttributeValidator({ ...schema, type: "binary" });

    expect(create("", validator)).toStrictEqual(new Uint8Array(0));
    expect(() => create(undefined, validator)).toThrow(StructError);

    const validator2 = createAttributeValidator({
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

  expectTypeOf(createAttributeValidator<IsAdmin>).returns.toEqualTypeOf<
    Describe<AttributeType<IsAdmin>>
  >();
  expectTypeOf(createAttributeValidator<Tags>).returns.toEqualTypeOf<
    Describe<AttributeType<Tags>>
  >();
  expectTypeOf(createAttributeValidator<CreatedAt>).returns.toEqualTypeOf<
    Describe<AttributeType<CreatedAt>>
  >();
  expectTypeOf(createAttributeValidator<Blobs>).returns.toEqualTypeOf<
    Describe<AttributeType<Blobs>>
  >();
});

test("Attribute Validator Type", () => {
  type IsAdmin = AttributeSchema<"isAdmin", "string", false, false, []>;
  type Tags = AttributeSchema<"tags", "string", true, true, ["work", "home"]>;
  type CreatedAt = AttributeSchema<"createdAt", "dateTime", false, true, []>;
  type Blobs = AttributeSchema<"blobs", "binary", true, false, []>;

  expectTypeOf(createAttributeValidator<IsAdmin>).returns.toEqualTypeOf<
    Describe<AttributeType<IsAdmin>>
  >();
  expectTypeOf(createAttributeValidator<Tags>).returns.toEqualTypeOf<
    Describe<AttributeType<Tags>>
  >();
  expectTypeOf(createAttributeValidator<CreatedAt>).returns.toEqualTypeOf<
    Describe<AttributeType<CreatedAt>>
  >();
  expectTypeOf(createAttributeValidator<Blobs>).returns.toEqualTypeOf<
    Describe<AttributeType<Blobs>>
  >();
});
