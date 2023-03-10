import { expectTypeOf } from "expect-type";

import { Mutability, Returned, Type, Uniqueness } from "../characteristics";

import { AttributeSchema } from ".";

describe("Attribute Schema", () => {
  type Unknown = AttributeSchema;
  type IsAdmin = AttributeSchema<"isAdmin", "string", false, false, []>;
  type Tags = AttributeSchema<"tags", "string", true, true, ["work", "home"]>;
  type CreatedAt = AttributeSchema<"createdAt", "dateTime", false, true, []>;
  type Blobs = AttributeSchema<"blobs", "binary", true, false, []>;
  type Complex = AttributeSchema<
    "combined",
    "complex",
    true,
    true,
    [],
    [IsAdmin, CreatedAt]
  >;

  test("Name", () => {
    expectTypeOf<Unknown["name"]>().toEqualTypeOf<string>();
    expectTypeOf<IsAdmin["name"]>().toEqualTypeOf<"isAdmin">();
    expectTypeOf<Tags["name"]>().toEqualTypeOf<"tags">();
    expectTypeOf<CreatedAt["name"]>().toEqualTypeOf<"createdAt">();
    expectTypeOf<Blobs["name"]>().toEqualTypeOf<"blobs">();
    expectTypeOf<Complex["name"]>().toEqualTypeOf<"combined">();
  });

  test("Type", () => {
    expectTypeOf<Unknown["type"]>().toEqualTypeOf<Type>();
    expectTypeOf<IsAdmin["type"]>().toEqualTypeOf<"string">();
    expectTypeOf<Tags["type"]>().toEqualTypeOf<"string">();
    expectTypeOf<CreatedAt["type"]>().toEqualTypeOf<"dateTime">();
    expectTypeOf<Blobs["type"]>().toEqualTypeOf<"binary">();
    expectTypeOf<Complex["type"]>().toEqualTypeOf<"complex">();
  });

  test("MultiValued", () => {
    expectTypeOf<Unknown["multiValued"]>().toEqualTypeOf<boolean>();
    expectTypeOf<IsAdmin["multiValued"]>().toEqualTypeOf<false>();
    expectTypeOf<Tags["multiValued"]>().toEqualTypeOf<true>();
    expectTypeOf<CreatedAt["multiValued"]>().toEqualTypeOf<false>();
    expectTypeOf<Blobs["multiValued"]>().toEqualTypeOf<true>();
    expectTypeOf<Complex["multiValued"]>().toEqualTypeOf<true>();
  });

  test("Description", () => {
    expectTypeOf<Unknown["description"]>().toEqualTypeOf<string>();
    expectTypeOf<IsAdmin["description"]>().toEqualTypeOf<string>();
    expectTypeOf<Tags["description"]>().toEqualTypeOf<string>();
    expectTypeOf<CreatedAt["description"]>().toEqualTypeOf<string>();
    expectTypeOf<Blobs["description"]>().toEqualTypeOf<string>();
    expectTypeOf<Complex["description"]>().toEqualTypeOf<string>();
  });

  test("Required", () => {
    expectTypeOf<Unknown["required"]>().toEqualTypeOf<boolean>();
    expectTypeOf<IsAdmin["required"]>().toEqualTypeOf<false>();
    expectTypeOf<Tags["required"]>().toEqualTypeOf<true>();
    expectTypeOf<CreatedAt["required"]>().toEqualTypeOf<true>();
    expectTypeOf<Blobs["required"]>().toEqualTypeOf<false>();
    expectTypeOf<Complex["required"]>().toEqualTypeOf<true>();
  });

  test("Canonical Values", () => {
    expectTypeOf<Unknown["canonicalValues"]>().toEqualTypeOf<string[]>();
    expectTypeOf<IsAdmin["canonicalValues"]>().toEqualTypeOf<[]>();
    expectTypeOf<Tags["canonicalValues"]>().toEqualTypeOf<["work", "home"]>();
    expectTypeOf<CreatedAt["canonicalValues"]>().toEqualTypeOf<[]>();
    expectTypeOf<Blobs["canonicalValues"]>().toEqualTypeOf<[]>();
    expectTypeOf<Complex["canonicalValues"]>().toEqualTypeOf<[]>();
  });

  test("Case Exact", () => {
    expectTypeOf<Unknown["caseExact"]>().toEqualTypeOf<boolean>();
    expectTypeOf<IsAdmin["caseExact"]>().toEqualTypeOf<boolean>();
    expectTypeOf<Tags["caseExact"]>().toEqualTypeOf<boolean>();
    expectTypeOf<CreatedAt["caseExact"]>().toEqualTypeOf<boolean>();
    expectTypeOf<Blobs["caseExact"]>().toEqualTypeOf<boolean>();
    expectTypeOf<Complex["caseExact"]>().toEqualTypeOf<boolean>();
  });

  test("Mutability", () => {
    expectTypeOf<Unknown["mutability"]>().toEqualTypeOf<Mutability>();
    expectTypeOf<IsAdmin["mutability"]>().toEqualTypeOf<Mutability>();
    expectTypeOf<Tags["mutability"]>().toEqualTypeOf<Mutability>();
    expectTypeOf<CreatedAt["mutability"]>().toEqualTypeOf<Mutability>();
    expectTypeOf<Blobs["mutability"]>().toEqualTypeOf<Mutability>();
    expectTypeOf<Complex["mutability"]>().toEqualTypeOf<Mutability>();
  });

  test("Returned", () => {
    expectTypeOf<Unknown["returned"]>().toEqualTypeOf<Returned>();
    expectTypeOf<IsAdmin["returned"]>().toEqualTypeOf<Returned>();
    expectTypeOf<Tags["returned"]>().toEqualTypeOf<Returned>();
    expectTypeOf<CreatedAt["returned"]>().toEqualTypeOf<Returned>();
    expectTypeOf<Blobs["returned"]>().toEqualTypeOf<Returned>();
    expectTypeOf<Complex["returned"]>().toEqualTypeOf<Returned>();
  });

  test("Uniqueness", () => {
    expectTypeOf<Unknown["uniqueness"]>().toEqualTypeOf<Uniqueness>();
    expectTypeOf<IsAdmin["uniqueness"]>().toEqualTypeOf<Uniqueness>();
    expectTypeOf<Tags["uniqueness"]>().toEqualTypeOf<Uniqueness>();
    expectTypeOf<CreatedAt["uniqueness"]>().toEqualTypeOf<Uniqueness>();
    expectTypeOf<Blobs["uniqueness"]>().toEqualTypeOf<Uniqueness>();
    expectTypeOf<Complex["uniqueness"]>().toEqualTypeOf<Uniqueness>();
  });

  test("Sub Attributes", () => {
    expectTypeOf<Unknown>().not.toHaveProperty("subAttributes");
    expectTypeOf<IsAdmin>().not.toHaveProperty("subAttributes");
    expectTypeOf<Tags>().not.toHaveProperty("subAttributes");
    expectTypeOf<CreatedAt>().not.toHaveProperty("subAttributes");
    expectTypeOf<Blobs>().not.toHaveProperty("subAttributes");
    expectTypeOf<Complex["subAttributes"]>().toEqualTypeOf<
      [IsAdmin, CreatedAt]
    >();
  });
});
