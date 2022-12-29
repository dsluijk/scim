import { create, StructError } from "superstruct";

import { Schema } from "../schema";

import enterpriseUserSchema from "../schemas/enterpriseUser.json";
import groupSchema from "../schemas/group.json";
import resourceTypeSchema from "../schemas/resourceType.json";
import schemaSchema from "../schemas/schema.json";
import serviceProviderConfigSchema from "../schemas/serviceProviderConfig.json";
import userSchema from "../schemas/user.json";

describe("Schema Parsing", () => {
  test("Valid JSON Input", () => {
    expect(groupSchema.id).toStrictEqual(
      "urn:ietf:params:scim:schemas:core:2.0:Group",
    );
    expect(groupSchema.name).toStrictEqual("Group");
  });

  test("Parses all core schemas", () => {
    expect(create(enterpriseUserSchema, Schema)).toMatchObject(
      enterpriseUserSchema,
    );
    expect(create(groupSchema, Schema)).toMatchObject(groupSchema);
    expect(create(resourceTypeSchema, Schema)).toMatchObject(
      resourceTypeSchema,
    );
    expect(create(schemaSchema, Schema)).toMatchObject(schemaSchema);
    expect(create(serviceProviderConfigSchema, Schema)).toMatchObject(
      serviceProviderConfigSchema,
    );
    expect(create(userSchema, Schema)).toMatchObject(userSchema);
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
