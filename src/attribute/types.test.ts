import { expectTypeOf } from "expect-type";

import { AttributeType, AttributeTypes } from "./types";
import { AttributeSchema } from "./schema";

describe("Attribute Value Type", () => {
  type IsAdmin = AttributeSchema<"isAdmin", "string", false, false, []>;
  type Tags = AttributeSchema<"tags", "string", true, true, ["work", "home"]>;
  type CreatedAt = AttributeSchema<"createdAt", "dateTime", false, true, []>;
  type Blobs = AttributeSchema<"blobs", "binary", true, false, []>;

  test("Individual", () => {
    expectTypeOf<AttributeType<IsAdmin>>().toEqualTypeOf<string | undefined>();
    expectTypeOf<AttributeType<Tags>>().toEqualTypeOf<("work" | "home")[]>();
    expectTypeOf<AttributeType<CreatedAt>>().toEqualTypeOf<Date>();
    expectTypeOf<AttributeType<Blobs>>().toEqualTypeOf<
      Uint8Array[] | undefined
    >();
  });

  test("Simple List", () => {
    expectTypeOf<
      AttributeTypes<[IsAdmin, Tags, CreatedAt, Blobs]>
    >().toEqualTypeOf<{
      isAdmin?: string | undefined;
      tags: ("work" | "home")[];
      createdAt: Date;
      blobs?: Uint8Array[] | undefined;
    }>();
  });
});
