import { create, Describe, StructError } from "superstruct";
import { expectTypeOf } from "expect-type";

import { SchemaMeta } from "./meta";

const date1 =
  "Thu Jan 01 2000 12:00:00 GMT+0100 (Central European Standard Time)";
const date2 =
  "Thu Jan 01 2001 12:00:00 GMT+0100 (Central European Standard Time)";

test("Parsing", () => {
  expect(create({}, SchemaMeta)).toStrictEqual({});
  expect(
    create(
      {
        resourceType: "Users",
        created: date1,
        lastModified: date2,
        location: "/Users/jdoe",
        version: "42",
      },
      SchemaMeta,
    ),
  ).toStrictEqual({
    resourceType: "Users",
    created: new Date(date1),
    lastModified: new Date(date2),
    location: "/Users/jdoe",
    version: "42",
  });
  expect(() => create(undefined, SchemaMeta)).toThrow(StructError);
  expect(() => create({ resourceType: "" }, SchemaMeta)).toThrow(StructError);
  expect(() =>
    create({ created: date2, lastModified: date1 }, SchemaMeta),
  ).toThrow(StructError);
  expect(() => create({ lastModified: 12 }, SchemaMeta)).toThrow(StructError);
  expect(() => create({ location: "Mars" }, SchemaMeta)).toThrow(StructError);
  expect(() => create({ somethingElse: "" }, SchemaMeta)).toThrow(StructError);

  expectTypeOf(SchemaMeta).toEqualTypeOf<Describe<SchemaMeta>>();
});

test("Type", () => {
  expectTypeOf<SchemaMeta["resourceType"]>().toEqualTypeOf<
    string | undefined
  >();
  expectTypeOf<SchemaMeta["created"]>().toEqualTypeOf<Date | undefined>();
  expectTypeOf<SchemaMeta["lastModified"]>().toEqualTypeOf<Date | undefined>();
  expectTypeOf<SchemaMeta["location"]>().toEqualTypeOf<string | undefined>();
  expectTypeOf<SchemaMeta["version"]>().toEqualTypeOf<string | undefined>();
});
