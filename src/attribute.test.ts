import { create, StructError } from "superstruct";

import {
  Attribute,
  AttributeMutability,
  AttributeReturned,
  AttributeType,
  AttributeUniqueness,
} from "./attribute";

const valid = {
  name: "displayName",
  type: "string",
  multiValued: false,
  description: "The name of the User, suitable for display to end-users.",
  required: false,
  caseExact: false,
  mutability: "readWrite",
  returned: "default",
  uniqueness: "none",
} as const;

describe("Attribute Parse", () => {
  test("Known valid", () => {
    expect(create(valid, Attribute)).toStrictEqual(valid);
  });

  test("Name", () => {
    // Name is required.
    expect(() => create({ ...valid, name: undefined }, Attribute)).toThrow(
      StructError,
    );
    // The name can contain non-alpha characters after the first.
    expect(
      create({ ...valid, name: "d$i$s$p$l$a$y$N$a$m$e$" }, Attribute),
    ).toStrictEqual({
      ...valid,
      name: "d$i$s$p$l$a$y$N$a$m$e$",
    });
    // "$ref" as a name is allowed by exception.
    expect(create({ ...valid, name: "$ref" }, Attribute)).toStrictEqual({
      ...valid,
      name: "$ref",
    });
    // Non-alpha characters are disallowed as the first character.
    expect(() => create({ ...valid, name: "$displayName" }, Attribute)).toThrow(
      StructError,
    );
  });

  test("Description", () => {
    // Description is required.
    expect(() =>
      create({ ...valid, description: undefined }, Attribute),
    ).toThrow(StructError);
    // Description must not be empty
    expect(() => create({ ...valid, description: "" }, Attribute)).toThrow(
      StructError,
    );
    expect(
      create({ ...valid, description: "Some description" }, Attribute),
    ).toStrictEqual({
      ...valid,
      description: "Some description",
    });
  });

  test("Type", () => {
    expect(create({ ...valid, type: undefined }, Attribute)).toStrictEqual({
      ...valid,
      type: AttributeType.string,
    });
    expect(create({ ...valid, type: "string" }, Attribute)).toStrictEqual({
      ...valid,
      type: AttributeType.string,
    });
    expect(create({ ...valid, type: "boolean" }, Attribute)).toStrictEqual({
      ...valid,
      type: AttributeType.boolean,
    });
    expect(create({ ...valid, type: "decimal" }, Attribute)).toStrictEqual({
      ...valid,
      type: AttributeType.decimal,
    });
    expect(create({ ...valid, type: "integer" }, Attribute)).toStrictEqual({
      ...valid,
      type: AttributeType.integer,
    });
    expect(create({ ...valid, type: "dateTime" }, Attribute)).toStrictEqual({
      ...valid,
      type: AttributeType.dateTime,
    });
    expect(create({ ...valid, type: "reference" }, Attribute)).toStrictEqual({
      ...valid,
      type: AttributeType.reference,
    });
    expect(create({ ...valid, type: "complex" }, Attribute)).toStrictEqual({
      ...valid,
      type: AttributeType.complex,
    });
    expect(() => create({ ...valid, type: "class" }, Attribute)).toThrow(
      StructError,
    );
  });

  test("Multi-valued", () => {
    // Multi-valued is required.
    expect(() =>
      create({ ...valid, multiValued: undefined }, Attribute),
    ).toThrow(StructError);
    expect(create({ ...valid, multiValued: true }, Attribute)).toStrictEqual({
      ...valid,
      multiValued: true,
    });
    expect(create({ ...valid, multiValued: false }, Attribute)).toStrictEqual({
      ...valid,
      multiValued: false,
    });
    expect(() => create({ ...valid, multiValued: "yes" }, Attribute)).toThrow(
      StructError,
    );
  });

  test("Mutability", () => {
    expect(
      create({ ...valid, mutability: undefined }, Attribute),
    ).toStrictEqual({
      ...valid,
      mutability: AttributeMutability.readWrite,
    });
    expect(
      create({ ...valid, mutability: "readWrite" }, Attribute),
    ).toStrictEqual({
      ...valid,
      mutability: AttributeMutability.readWrite,
    });

    expect(
      create({ ...valid, mutability: "readOnly" }, Attribute),
    ).toStrictEqual({
      ...valid,
      mutability: AttributeMutability.readOnly,
    });
    expect(
      create({ ...valid, mutability: "immutable" }, Attribute),
    ).toStrictEqual({
      ...valid,
      mutability: AttributeMutability.immutable,
    });
    expect(
      create({ ...valid, mutability: "writeOnly" }, Attribute),
    ).toStrictEqual({
      ...valid,
      mutability: AttributeMutability.writeOnly,
    });
    expect(() => create({ ...valid, mutability: "yes" }, Attribute)).toThrow(
      StructError,
    );
  });

  test("Returned", () => {
    expect(create({ ...valid, returned: undefined }, Attribute)).toStrictEqual({
      ...valid,
      returned: AttributeReturned.default,
    });
    expect(create({ ...valid, returned: "always" }, Attribute)).toStrictEqual({
      ...valid,
      returned: AttributeReturned.always,
    });
    expect(create({ ...valid, returned: "never" }, Attribute)).toStrictEqual({
      ...valid,
      returned: AttributeReturned.never,
    });
    expect(create({ ...valid, returned: "default" }, Attribute)).toStrictEqual({
      ...valid,
      returned: AttributeReturned.default,
    });
    expect(create({ ...valid, returned: "request" }, Attribute)).toStrictEqual({
      ...valid,
      returned: AttributeReturned.request,
    });
    expect(() => create({ ...valid, returned: "yes" }, Attribute)).toThrow(
      StructError,
    );
  });

  test("Uniqueness", () => {
    expect(
      create({ ...valid, uniqueness: undefined }, Attribute),
    ).toStrictEqual({
      ...valid,
      uniqueness: AttributeUniqueness.none,
    });
    expect(create({ ...valid, uniqueness: "none" }, Attribute)).toStrictEqual({
      ...valid,
      uniqueness: AttributeUniqueness.none,
    });
    expect(create({ ...valid, uniqueness: "server" }, Attribute)).toStrictEqual(
      {
        ...valid,
        uniqueness: AttributeUniqueness.server,
      },
    );
    expect(create({ ...valid, uniqueness: "global" }, Attribute)).toStrictEqual(
      {
        ...valid,
        uniqueness: AttributeUniqueness.global,
      },
    );
    expect(() => create({ ...valid, uniqueness: "yes" }, Attribute)).toThrow(
      StructError,
    );
  });
});
