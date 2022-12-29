import { create, StructError } from "superstruct";

import { Schema } from "./schema";

import groupSchema from "./schemas/group.json";

describe("Schema Parsing", () => {
  test("Valid JSON Input", () => {
    expect(groupSchema.id).toStrictEqual(
      "urn:ietf:params:scim:schemas:core:2.0:Group",
    );
    expect(groupSchema.name).toStrictEqual("Group");
  });

  test("Parses group", () => {
    expect(create(groupSchema, Schema)).toMatchObject(groupSchema);
  });

  test("ID", () => {
    expect(() => create({ ...groupSchema, id: undefined }, Schema)).toThrow(
      StructError,
    );
    expect(() => create({ ...groupSchema, id: 42 }, Schema)).toThrow(
      StructError,
    );
    expect(() => create({ ...groupSchema, id: "" }, Schema)).toThrow(
      StructError,
    );
  });

  test("Metadata", () => {
    const date1 =
      "Thu Jan 01 2000 12:00:00 GMT+0100 (Central European Standard Time)";
    const date2 =
      "Thu Dec 31 2000 12:00:00 GMT+0100 (Central European Standard Time)";
    expect(create({ ...groupSchema, meta: undefined }, Schema)).toMatchObject({
      ...groupSchema,
      meta: undefined,
    });

    expect(
      create(
        {
          ...groupSchema,
          meta: {
            lastModified: date1,
          },
        },
        Schema,
      ),
    ).toMatchObject({
      ...groupSchema,
      meta: {
        lastModified: new Date(date1),
      },
    });

    expect(
      create(
        {
          ...groupSchema,
          meta: {
            created: date1,
            lastModified: date2,
          },
        },
        Schema,
      ),
    ).toMatchObject({
      ...groupSchema,
      meta: {
        created: new Date(date1),
        lastModified: new Date(date2),
      },
    });
  });

  test("Attributes", () => {
    expect(() =>
      create({ ...groupSchema, attributes: undefined }, Schema),
    ).toThrow(StructError);
    expect(() => create({ ...groupSchema, attributes: 42 }, Schema)).toThrow(
      StructError,
    );
    expect(() => create({ ...groupSchema, attributes: [] }, Schema)).toThrow(
      StructError,
    );
  });
});
