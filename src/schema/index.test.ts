import { create, Describe, StructError } from "superstruct";
import { expectTypeOf } from "expect-type";

import EnterpriseUserJson from "./buildin/enterpriseUser.json";
import GroupJson from "./buildin/group.json";
import ResourceTypeJson from "./buildin/resourceType.json";
import SchemaJson from "./buildin/schema.json";
import ServiceProviderConfigJson from "./buildin/serviceProviderConfig.json";
import UserJson from "./buildin/user.json";

import { Schema } from ".";

test("Parses Build-in Schemas", () => {
  expect(create(EnterpriseUserJson, Schema)).toBeDefined();
  expect(create(GroupJson, Schema)).toBeDefined();
  expect(create(ResourceTypeJson, Schema)).toBeDefined();
  // The schema definition has nested complex types, which is disallowed by the definition.
  expect(() => create(SchemaJson, Schema)).toThrow(StructError);
  expect(create(ServiceProviderConfigJson, Schema)).toBeDefined();
  expect(create(UserJson, Schema)).toBeDefined();

  expectTypeOf(Schema).toEqualTypeOf<Describe<Schema>>();
});

test("Parses Self Defined Schemas", () => {
  const userName = {
    name: "username",
    type: "string",
    multiValued: false,
    description: "Unique identifier for the User.",
    required: true,
    caseExact: false,
    returned: "default",
    uniqueness: "server",
  };

  expect(
    create(
      {
        id: "SimpleUser",
        attributes: [userName],
      },
      Schema,
    ),
  ).toStrictEqual({
    id: "SimpleUser",
    attributes: [{ ...userName, mutability: "readWrite", canonicalValues: [] }],
  });

  expect(() => create({}, Schema)).toThrow(StructError);
  expect(() =>
    create(
      {
        id: "yeet",
      },
      Schema,
    ),
  ).toThrow(StructError);
  expect(() =>
    create(
      {
        id: "yeet",
        attributes: [],
      },
      Schema,
    ),
  ).toThrow(StructError);
  expect(() =>
    create(
      {
        id: "yeet",
        attributes: [{ ...userName, name: undefined }],
      },
      Schema,
    ),
  ).toThrow(StructError);
});
