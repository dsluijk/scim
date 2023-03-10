import { create, StructError } from "superstruct";
import { expectTypeOf } from "expect-type";

import {
  CanonicalValues,
  CaseExact,
  ComplexType,
  Description,
  MultiValued,
  Mutability,
  Name,
  ReferenceType,
  Required,
  Returned,
  SimpleType,
  Type,
  Uniqueness,
} from "./characteristics";

test("Name", () => {
  // Name is required.
  expect(() => create(undefined, Name)).toThrow(StructError);
  // The name can contain non-alpha characters after the first.
  expect(create("d$i$s$p$l$a$y$n$a$m$e$", Name)).toStrictEqual(
    "d$i$s$p$l$a$y$n$a$m$e$",
  );
  // Name is automatically lower cased.
  expect(create("SOME_name", Name)).toStrictEqual("some_name");
  // "$ref" is not allowed as a general name.
  expect(() => create("$ref", Name)).toThrow(StructError);
  // Non-alpha characters are disallowed as the first character.
  expect(() => create("$displayName", Name)).toThrow(StructError);

  expectTypeOf(create("name", Name)).toEqualTypeOf<Name>();
});

test("Type", () => {
  expect(create(undefined, Type)).toStrictEqual("string");
  expect(create("string", Type)).toStrictEqual("string");
  expect(create("boolean", Type)).toStrictEqual("boolean");
  expect(create("decimal", Type)).toStrictEqual("decimal");
  expect(create("integer", Type)).toStrictEqual("integer");
  expect(create("dateTime", Type)).toStrictEqual("dateTime");
  expect(create("binary", Type)).toStrictEqual("binary");
  expect(create("complex", Type)).toStrictEqual("complex");
  expect(create("reference", Type)).toStrictEqual("reference");
  expect(() => create("class", Type)).toThrow(StructError);

  expect(create(undefined, SimpleType)).toStrictEqual("string");
  expect(create("string", SimpleType)).toStrictEqual("string");
  expect(create("boolean", SimpleType)).toStrictEqual("boolean");
  expect(create("decimal", SimpleType)).toStrictEqual("decimal");
  expect(create("integer", SimpleType)).toStrictEqual("integer");
  expect(create("dateTime", SimpleType)).toStrictEqual("dateTime");
  expect(create("binary", SimpleType)).toStrictEqual("binary");
  expect(() => create("complex", SimpleType)).toThrow(StructError);
  expect(() => create("reference", SimpleType)).toThrow(StructError);
  expect(() => create("class", SimpleType)).toThrow(StructError);

  expect(() => create(undefined, ComplexType)).toThrow(StructError);
  expect(() => create("string", ComplexType)).toThrow(StructError);
  expect(() => create("boolean", ComplexType)).toThrow(StructError);
  expect(() => create("decimal", ComplexType)).toThrow(StructError);
  expect(() => create("integer", ComplexType)).toThrow(StructError);
  expect(() => create("dateTime", ComplexType)).toThrow(StructError);
  expect(() => create("binary", ComplexType)).toThrow(StructError);
  expect(create("complex", ComplexType)).toStrictEqual("complex");
  expect(() => create("reference", ComplexType)).toThrow(StructError);
  expect(() => create("class", ComplexType)).toThrow(StructError);

  expect(() => create(undefined, ReferenceType)).toThrow(StructError);
  expect(() => create("string", ReferenceType)).toThrow(StructError);
  expect(() => create("boolean", ReferenceType)).toThrow(StructError);
  expect(() => create("decimal", ReferenceType)).toThrow(StructError);
  expect(() => create("integer", ReferenceType)).toThrow(StructError);
  expect(() => create("dateTime", ReferenceType)).toThrow(StructError);
  expect(() => create("binary", ReferenceType)).toThrow(StructError);
  expect(() => create("complex", ReferenceType)).toThrow(StructError);
  expect(create("reference", ReferenceType)).toStrictEqual("reference");
  expect(() => create("class", ReferenceType)).toThrow(StructError);

  expectTypeOf(create("string", SimpleType)).toEqualTypeOf<SimpleType>();
  expectTypeOf(create("complex", ComplexType)).toEqualTypeOf<ComplexType>();
  expectTypeOf(
    create("reference", ReferenceType),
  ).toEqualTypeOf<ReferenceType>();
});

test("Multi-valued", () => {
  // Multi-valued is required.
  expect(() => create(undefined, MultiValued)).toThrow(StructError);
  expect(create(true, MultiValued)).toStrictEqual(true);
  expect(create(false, MultiValued)).toStrictEqual(false);
  expect(() => create("yes", MultiValued)).toThrow(StructError);

  expectTypeOf(create(true, MultiValued)).toEqualTypeOf<MultiValued>();
});

test("Description", () => {
  // Unspecified descriptions default to an empty string.
  expect(create(undefined, Description)).toStrictEqual("");
  // Description can be empty.
  expect(create("", Description)).toStrictEqual("");
  expect(create("Some description", Description)).toStrictEqual(
    "Some description",
  );

  expectTypeOf(create("desc", Description)).toEqualTypeOf<Description>();
});

test("Required", () => {
  // Required characteristic is false by default.
  expect(create(undefined, Required)).toStrictEqual(false);
  expect(create(true, Required)).toStrictEqual(true);
  expect(create(false, Required)).toStrictEqual(false);
  expect(() => create("true", Required)).toThrow(StructError);

  expectTypeOf(create(true, Required)).toEqualTypeOf<Required>();
});

test("Canonical Values", () => {
  // Canonical values give an empty array of not given.
  expect(create(undefined, CanonicalValues)).toStrictEqual([]);
  expect(create([], CanonicalValues)).toStrictEqual([]);
  expect(create(["work", "home"], CanonicalValues)).toStrictEqual([
    "work",
    "home",
  ]);
  expect(() => create("true", CanonicalValues)).toThrow(StructError);
  expect(() => create([42], CanonicalValues)).toThrow(StructError);

  expectTypeOf(create([], CanonicalValues)).toEqualTypeOf<CanonicalValues>();
});

test("Case Exact", () => {
  // Case exact characteristic is false by default.
  expect(create(undefined, CaseExact)).toStrictEqual(false);
  expect(create(true, CaseExact)).toStrictEqual(true);
  expect(create(false, CaseExact)).toStrictEqual(false);
  expect(() => create("true", CaseExact)).toThrow(StructError);

  expectTypeOf(create(true, CaseExact)).toEqualTypeOf<CaseExact>();
});

test("Mutability", () => {
  // Mutability characteristic is `readWrite` by default.
  expect(create(undefined, Mutability)).toStrictEqual("readWrite");
  expect(create("readWrite", Mutability)).toStrictEqual("readWrite");
  expect(create("readOnly", Mutability)).toStrictEqual("readOnly");
  expect(create("immutable", Mutability)).toStrictEqual("immutable");
  expect(create("writeOnly", Mutability)).toStrictEqual("writeOnly");
  expect(() => create("yes", Mutability)).toThrow(StructError);

  expectTypeOf(create("readWrite", Mutability)).toEqualTypeOf<Mutability>();
});

test("Returned", () => {
  // Returned characteristic is `default` by default.
  expect(create(undefined, Returned)).toStrictEqual("default");
  expect(create("always", Returned)).toStrictEqual("always");
  expect(create("never", Returned)).toStrictEqual("never");
  expect(create("default", Returned)).toStrictEqual("default");
  expect(create("request", Returned)).toStrictEqual("request");
  expect(() => create("yes", Returned)).toThrow(StructError);

  expectTypeOf(create("default", Returned)).toEqualTypeOf<Returned>();
});

test("Uniqueness", () => {
  // Uniqueness characteristic is `none` by default.
  expect(create(undefined, Uniqueness)).toStrictEqual("none");
  expect(create("none", Uniqueness)).toStrictEqual("none");
  expect(create("server", Uniqueness)).toStrictEqual("server");
  expect(create("global", Uniqueness)).toStrictEqual("global");
  expect(() => create("yes", Uniqueness)).toThrow(StructError);

  expectTypeOf(create("none", Uniqueness)).toEqualTypeOf<Uniqueness>();
});
