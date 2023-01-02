import {
  assert,
  create,
  Describe,
  enums,
  literal,
  string,
  StructError,
} from "superstruct";
import { expectTypeOf } from "expect-type";

import {
  base64,
  dateString,
  lowercase,
  path,
  schemaUrn,
  uint8array,
  url,
} from "./validation";

describe("URL validation.", () => {
  test("Reject non-strings", () => {
    expect(() => assert(42, url())).toThrow(StructError);
    expect(() => assert({}, url())).toThrow(StructError);
    expect(() => assert([], url())).toThrow(StructError);
  });

  test("Accept HTTP URLs.", () => {
    expect(assert("https://npmjs.com/package/scim", url())).toBeUndefined();
    expect(assert("https://dany.dev", url())).toBeUndefined();
  });

  test("Reject bare URLs.", () => {
    expect(() => assert("npmjs.com/package/scim", url())).toThrow(StructError);
    expect(() => assert("dany.dev", url())).toThrow(StructError);
  });

  test("Reject relative URLs.", () => {
    expect(() => assert("/package/scim", url())).toThrow(StructError);
    expect(() => assert("/", url())).toThrow(StructError);
  });

  test("Return type is string", () => {
    const input: unknown = "https://dany.dev";

    expectTypeOf(input).toBeUnknown();
    assert(input, url());
    expectTypeOf(input).toBeString();
  });
});

describe("Path validation.", () => {
  test("Reject non-strings", () => {
    expect(() => assert(42, path())).toThrow(StructError);
    expect(() => assert({}, path())).toThrow(StructError);
    expect(() => assert([], path())).toThrow(StructError);
  });

  test("Reject HTTP URLs.", () => {
    expect(() => assert("https://npmjs.com/package/scim", path())).toThrow(
      StructError,
    );
    expect(() => assert("https://dany.dev", path())).toThrow(StructError);
  });

  test("Reject bare URLs.", () => {
    expect(() => assert("npmjs.com/package/scim", path())).toThrow(StructError);
    expect(() => assert("dany.dev", path())).toThrow(StructError);
  });

  test("Accept relative path.", () => {
    expect(assert("/package/scim", path())).toBeUndefined();
    expect(assert("/", path())).toBeUndefined();
  });

  test("Reject directory traversal path.", () => {
    expect(() => assert("/../package/scim", path())).toThrow(StructError);
    expect(() => assert("/..", path())).toThrow(StructError);
    expect(() => assert("../", path())).toThrow(StructError);
  });

  test("Return type is string", () => {
    const input: unknown = "https://dany.dev";

    expectTypeOf(input).toBeUnknown();
    assert(input, url());
    expectTypeOf(input).toBeString();
  });
});

describe("Date String validation.", () => {
  const input: unknown =
    "Thu Jan 01 2000 12:00:00 GMT+0100 (Central European Standard Time)";

  test("Reject non-strings", () => {
    expect(() => create(42, dateString())).toThrow(StructError);
    expect(() => create({}, dateString())).toThrow(StructError);
    expect(() => create([], dateString())).toThrow(StructError);
  });

  test("Reject invalid dates", () => {
    expect(() => create("", dateString())).toThrow(StructError);
    expect(() => create("IAMNOTADATE", dateString())).toThrow(StructError);
  });

  test("Accept a valid date.", () => {
    expect(create(input, dateString())).toStrictEqual(
      new Date(input as string),
    );
  });

  test("Return type is Date", () => {
    expectTypeOf(input).toBeUnknown();
    const out = create(input, dateString());
    expectTypeOf(out).toEqualTypeOf<Date>();
  });
});

describe("Base64 validation.", () => {
  test("Reject other types.", () => {
    expect(() => create(42, base64())).toThrow(StructError);
    expect(() => create({}, base64())).toThrow(StructError);
    expect(() => create([], base64())).toThrow(StructError);
  });

  test("Accept a valid base64 string.", () => {
    expect(create("", base64())).toStrictEqual(new Uint8Array(0));
    expect(create("SGVsbG8gV29ybGQh", base64())).toStrictEqual(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
    );
  });

  test("Rejects a invalid base64 string.", () => {
    expect(() => create("qwertyuiop", base64())).toThrow(StructError);
    expect(() => create("SGVsbG8gV29ybGQ", base64())).toThrow(StructError);
  });

  test("Accept valid Uint8Array.", () => {
    expect(create(new Uint8Array(0), base64())).toStrictEqual(
      new Uint8Array(0),
    );
  });

  test("Return type is Uint8Array.", () => {
    const input: unknown = new Uint8Array(0);
    expectTypeOf(input).toBeUnknown();
    const out = create(input, base64());
    expectTypeOf(out).toEqualTypeOf<Uint8Array>();
  });
});

describe("Uint8Array validation.", () => {
  test("Reject other types.", () => {
    expect(() => create(42, uint8array())).toThrow(StructError);
    expect(() => create({}, uint8array())).toThrow(StructError);
    expect(() => create([], uint8array())).toThrow(StructError);
  });

  test("Accept a valid Uint8Array.", () => {
    expect(create(new Uint8Array(0), uint8array())).toStrictEqual(
      new Uint8Array(0),
    );
  });

  test("Return type is Uint8Array.", () => {
    const input: unknown = new Uint8Array(0);
    expectTypeOf(input).toBeUnknown();
    const out = create(input, uint8array());
    expectTypeOf(out).toEqualTypeOf<Uint8Array>();
  });
});

describe("Lowercase string validation.", () => {
  test("Reject or ignore non-strings", () => {
    expect(() => create(42, lowercase(string()))).toThrow(StructError);
    expect(() => create({}, lowercase(string()))).toThrow(StructError);
    expect(() => create([], lowercase(string()))).toThrow(StructError);
    expect(
      create(1, lowercase(literal(1) as unknown as Describe<string>)),
    ).toStrictEqual(1);
    expect(
      create(1, lowercase(enums([1, 2]) as unknown as Describe<string>)),
    ).toStrictEqual(1);
  });

  test("Accept lowercased strings", () => {
    expect(create("", lowercase(string()))).toStrictEqual("");
    expect(create("some data", lowercase(string()))).toStrictEqual("some data");
    expect(create("other thing", lowercase(string()))).toStrictEqual(
      "other thing",
    );
  });

  test("Accept string enums", () => {
    expect(create("home", lowercase(enums(["home", "work"])))).toStrictEqual(
      "home",
    );
    expect(create("HOME", lowercase(enums(["home", "work"])))).toStrictEqual(
      "home",
    );
    expect(() => create("school", lowercase(enums(["home", "work"])))).toThrow(
      StructError,
    );
  });

  test("Accept string literal", () => {
    expect(create("home", lowercase(literal("home")))).toStrictEqual("home");
    expect(create("HOME", lowercase(literal("home")))).toStrictEqual("home");
    expect(() => create("home", lowercase(literal("HOME")))).toThrow(
      StructError,
    );
    expect(() => create("HOME", lowercase(literal("HOME")))).toThrow(
      StructError,
    );
    expect(() => create("work", lowercase(literal("home")))).toThrow(
      StructError,
    );
  });

  test("Transforms uppercased strings to lowercase", () => {
    expect(create("", lowercase(string()))).toStrictEqual("");
    expect(create("SOME DATA", lowercase(string()))).toStrictEqual("some data");
    expect(create("OTHER THING", lowercase(string()))).toStrictEqual(
      "other thing",
    );
    expect(create("MIXED thing!", lowercase(string()))).toStrictEqual(
      "mixed thing!",
    );
  });

  test("Return type is a string", () => {
    const input: unknown = "str";
    expectTypeOf().toBeUnknown();
    const out = create(input, lowercase(string()));
    expectTypeOf(out).toEqualTypeOf<string>();
  });
});

describe("Schema URN validation.", () => {
  test("Reject non-strings", () => {
    expect(() => assert(42, schemaUrn())).toThrow(StructError);
    expect(() => assert({}, schemaUrn())).toThrow(StructError);
    expect(() => assert([], schemaUrn())).toThrow(StructError);
  });

  test("Reject urn's with invalid syntax.", () => {
    expect(() => assert("scim:myApplication:MyUser", schemaUrn())).toThrow(
      StructError,
    );
    expect(() => assert("urn:ietf:params:scim:MyUser", schemaUrn())).toThrow(
      StructError,
    );
    expect(() =>
      assert("urn:ietf:params:scim:schemas:Application/MyUser", schemaUrn()),
    ).toThrow(StructError);
    expect(() =>
      assert("urn:ietf:params:scim:Application:MyUser", schemaUrn()),
    ).toThrow(StructError);
  });

  test("Reject custom schema's in reserved namespaces.", () => {
    // Core
    expect(() =>
      assert("urn:ietf:params:scim:schemas:core:MyUser", schemaUrn()),
    ).toThrow(StructError);
    expect(() =>
      assert(
        "urn:ietf:params:scim:schemas:core:Application2:OtherUser",
        schemaUrn(),
      ),
    ).toThrow(StructError);

    // Api
    expect(() =>
      assert("urn:ietf:params:scim:api:MyUser", schemaUrn()),
    ).toThrow(StructError);
    expect(() =>
      assert("urn:ietf:params:scim:api:Application2:OtherUser", schemaUrn()),
    ).toThrow(StructError);

    // Param
    expect(() =>
      assert("urn:ietf:params:scim:param:MyUser", schemaUrn()),
    ).toThrow(StructError);
    expect(() =>
      assert("urn:ietf:params:scim:param:Application2:OtherUser", schemaUrn()),
    ).toThrow(StructError);
  });

  test("Accept custom schema's in it's own namespace.", () => {
    expect(
      assert("urn:ietf:params:scim:schemas:Application:MyUser", schemaUrn()),
    ).toBeUndefined();
    expect(
      assert(
        "urn:ietf:params:scim:schemas:Application2:OtherUser",
        schemaUrn(),
      ),
    ).toBeUndefined();
  });

  test("Accept schema's from spec.", () => {
    // Default
    expect(
      assert("urn:ietf:params:scim:schemas:core:2.0:User", schemaUrn()),
    ).toBeUndefined();
    expect(
      assert(
        "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
        schemaUrn(),
      ),
    ).toBeUndefined();
    expect(
      assert("urn:ietf:params:scim:schemas:core:2.0:Group", schemaUrn()),
    ).toBeUndefined();

    // Service
    expect(
      assert(
        "urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig",
        schemaUrn(),
      ),
    ).toBeUndefined();
    expect(
      assert("urn:ietf:params:scim:schemas:core:2.0:ResourceType", schemaUrn()),
    ).toBeUndefined();
    expect(
      assert("urn:ietf:params:scim:schemas:core:2.0:Schema", schemaUrn()),
    ).toBeUndefined();
  });

  test("Return type is string", () => {
    const input: unknown = "urn:ietf:params:scim:schemas:core:2.0:User";

    expectTypeOf(input).toBeUnknown();
    assert(input, schemaUrn());
    expectTypeOf(input).toBeString();
  });
});
