import { expectTypeOf } from "expect-type";
import { StructError } from "superstruct";

import { AttributeSchema, createAttributeSchema } from "./schema";
import { Mutability, Returned, Type, Uniqueness } from "./characteristics";

describe("Attribute Schema", () => {
  type Unknown = AttributeSchema;
  type IsAdmin = AttributeSchema<"isAdmin", "string", false, false, []>;
  type Tags = AttributeSchema<"tags", "string", true, true, ["work", "home"]>;
  type CreatedAt = AttributeSchema<"createdAt", "dateTime", false, true, []>;
  type Blobs = AttributeSchema<"blobs", "binary", true, false, []>;

  test("Name", () => {
    expectTypeOf<Unknown["name"]>().toEqualTypeOf<string>();
    expectTypeOf<IsAdmin["name"]>().toEqualTypeOf<"isAdmin">();
    expectTypeOf<Tags["name"]>().toEqualTypeOf<"tags">();
    expectTypeOf<CreatedAt["name"]>().toEqualTypeOf<"createdAt">();
    expectTypeOf<Blobs["name"]>().toEqualTypeOf<"blobs">();
  });

  test("Type", () => {
    expectTypeOf<Unknown["type"]>().toEqualTypeOf<Type>();
    expectTypeOf<IsAdmin["type"]>().toEqualTypeOf<"string">();
    expectTypeOf<Tags["type"]>().toEqualTypeOf<"string">();
    expectTypeOf<CreatedAt["type"]>().toEqualTypeOf<"dateTime">();
    expectTypeOf<Blobs["type"]>().toEqualTypeOf<"binary">();
  });

  test("MultiValued", () => {
    expectTypeOf<Unknown["multiValued"]>().toEqualTypeOf<boolean>();
    expectTypeOf<IsAdmin["multiValued"]>().toEqualTypeOf<false>();
    expectTypeOf<Tags["multiValued"]>().toEqualTypeOf<true>();
    expectTypeOf<CreatedAt["multiValued"]>().toEqualTypeOf<false>();
    expectTypeOf<Blobs["multiValued"]>().toEqualTypeOf<true>();
  });

  test("Description", () => {
    expectTypeOf<Unknown["description"]>().toEqualTypeOf<string>();
    expectTypeOf<IsAdmin["description"]>().toEqualTypeOf<string>();
    expectTypeOf<Tags["description"]>().toEqualTypeOf<string>();
    expectTypeOf<CreatedAt["description"]>().toEqualTypeOf<string>();
    expectTypeOf<Blobs["description"]>().toEqualTypeOf<string>();
  });

  test("Required", () => {
    expectTypeOf<Unknown["required"]>().toEqualTypeOf<boolean>();
    expectTypeOf<IsAdmin["required"]>().toEqualTypeOf<false>();
    expectTypeOf<Tags["required"]>().toEqualTypeOf<true>();
    expectTypeOf<CreatedAt["required"]>().toEqualTypeOf<true>();
    expectTypeOf<Blobs["required"]>().toEqualTypeOf<false>();
  });

  test("Canonical Values", () => {
    expectTypeOf<Unknown["canonicalValues"]>().toEqualTypeOf<string[]>();
    expectTypeOf<IsAdmin["canonicalValues"]>().toEqualTypeOf<[]>();
    expectTypeOf<Tags["canonicalValues"]>().toEqualTypeOf<["work", "home"]>();
    expectTypeOf<CreatedAt["canonicalValues"]>().toEqualTypeOf<[]>();
    expectTypeOf<Blobs["canonicalValues"]>().toEqualTypeOf<[]>();
  });

  test("Case Exact", () => {
    expectTypeOf<Unknown["caseExact"]>().toEqualTypeOf<boolean>();
    expectTypeOf<IsAdmin["caseExact"]>().toEqualTypeOf<boolean>();
    expectTypeOf<Tags["caseExact"]>().toEqualTypeOf<boolean>();
    expectTypeOf<CreatedAt["caseExact"]>().toEqualTypeOf<boolean>();
    expectTypeOf<Blobs["caseExact"]>().toEqualTypeOf<boolean>();
  });

  test("Mutability", () => {
    expectTypeOf<Unknown["mutability"]>().toEqualTypeOf<Mutability>();
    expectTypeOf<IsAdmin["mutability"]>().toEqualTypeOf<Mutability>();
    expectTypeOf<Tags["mutability"]>().toEqualTypeOf<Mutability>();
    expectTypeOf<CreatedAt["mutability"]>().toEqualTypeOf<Mutability>();
    expectTypeOf<Blobs["mutability"]>().toEqualTypeOf<Mutability>();
  });

  test("Returned", () => {
    expectTypeOf<Unknown["returned"]>().toEqualTypeOf<Returned>();
    expectTypeOf<IsAdmin["returned"]>().toEqualTypeOf<Returned>();
    expectTypeOf<Tags["returned"]>().toEqualTypeOf<Returned>();
    expectTypeOf<CreatedAt["returned"]>().toEqualTypeOf<Returned>();
    expectTypeOf<Blobs["returned"]>().toEqualTypeOf<Returned>();
  });

  test("Uniqueness", () => {
    expectTypeOf<Unknown["uniqueness"]>().toEqualTypeOf<Uniqueness>();
    expectTypeOf<IsAdmin["uniqueness"]>().toEqualTypeOf<Uniqueness>();
    expectTypeOf<Tags["uniqueness"]>().toEqualTypeOf<Uniqueness>();
    expectTypeOf<CreatedAt["uniqueness"]>().toEqualTypeOf<Uniqueness>();
    expectTypeOf<Blobs["uniqueness"]>().toEqualTypeOf<Uniqueness>();
  });

  test("Sub Attributes", () => {
    expectTypeOf<Unknown["subAttributes"]>().toEqualTypeOf<
      unknown[] | undefined
    >();
    expectTypeOf<IsAdmin["subAttributes"]>().toEqualTypeOf<
      unknown[] | undefined
    >();
    expectTypeOf<Tags["subAttributes"]>().toEqualTypeOf<
      unknown[] | undefined
    >();
    expectTypeOf<CreatedAt["subAttributes"]>().toEqualTypeOf<
      unknown[] | undefined
    >();
    expectTypeOf<Blobs["subAttributes"]>().toEqualTypeOf<
      unknown[] | undefined
    >();
  });

  test("Reference Types", () => {
    expectTypeOf<Unknown["referenceTypes"]>().toEqualTypeOf<
      unknown[] | undefined
    >();
    expectTypeOf<IsAdmin["referenceTypes"]>().toEqualTypeOf<
      unknown[] | undefined
    >();
    expectTypeOf<Tags["referenceTypes"]>().toEqualTypeOf<
      unknown[] | undefined
    >();
    expectTypeOf<CreatedAt["referenceTypes"]>().toEqualTypeOf<
      unknown[] | undefined
    >();
    expectTypeOf<Blobs["referenceTypes"]>().toEqualTypeOf<
      unknown[] | undefined
    >();
  });
});

describe("Create Attribute Schema", () => {
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

  test("Idempotency", () => {
    expect(createAttributeSchema(baseSchema)).toStrictEqual(baseSchema);
  });

  test("Defaults autofills", () => {
    expect(
      createAttributeSchema({
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
    ).toStrictEqual(baseSchema);
  });

  test("Invalid Schema Throws", () => {
    expect(() => createAttributeSchema(undefined as unknown as object)).toThrow(
      StructError,
    );
    expect(() => createAttributeSchema(42 as unknown as object)).toThrow(
      StructError,
    );
    expect(() => createAttributeSchema({ ...baseSchema, answer: 42 })).toThrow(
      StructError,
    );
  });

  test("Missing Required Throws", () => {
    expect(() =>
      createAttributeSchema({ ...baseSchema, name: undefined }),
    ).toThrow(StructError);
    expect(() =>
      createAttributeSchema({ ...baseSchema, multiValued: undefined }),
    ).toThrow(StructError);
  });

  test("Correct Type", () => {
    expectTypeOf(createAttributeSchema(baseSchema)).toEqualTypeOf<
      AttributeSchema<"name", "string", false, false, []>
    >();
  });
});
