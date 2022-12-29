import { assert, StructError } from "superstruct";
import { expectTypeOf } from "expect-type";

import { path, schemaUrn, url } from "./validation";

describe("URL validation", () => {
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

describe("Path validation", () => {
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

describe("Schema URN validation", () => {
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
