import {
  CanonicalValues,
  MultiValued,
  Name,
  Required,
  Type,
} from "./characteristics";
import { AttributeSchema } from "./schema";

/**
 * Get the basic type from the type charateristic.
 */
type TypeFromType<T extends Type, C extends CanonicalValues> = {
  string: C extends [] ? string : C extends never[] ? string : C[number];
  boolean: boolean;
  decimal: number;
  integer: number;
  dateTime: Date;
  binary: Uint8Array;
  reference: unknown; // todo
  complex: unknown; // todo
}[T];

/**
 * Creates a TypeScript type from an attribute schema.
 */
export type AttributeType<AS extends AttributeSchema> =
  AS extends AttributeSchema<
    Name,
    infer T extends Type,
    infer M extends MultiValued,
    infer R extends Required,
    infer C extends CanonicalValues
  >
    ?
        | (M extends true ? TypeFromType<T, C>[] : TypeFromType<T, C>)
        | (R extends true ? never : undefined)
    : never;

/**
 * Identity type mapping.
 * Doesn't change the type, but it flattens intersections so it's easier to read.
 */
type Identity<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
/**
 * Creates a subset of attributes which are required.
 * Set the second generic parameter to `false` to create the inverse subset.
 */
type IsRequired<
  AS extends AttributeSchema,
  I extends boolean = true,
> = AS["required"] extends I ? AS["name"] : never;

/**
 * Maps a list of attribute schema's to an object with the correct names & TypeScript types.
 */
export type AttributeTypes<AS extends AttributeSchema[]> = Identity<
  {
    [K in Extract<keyof AS, `${number}`> as IsRequired<AS[K]>]: AttributeType<
      AS[K]
    >;
  } & {
    [K in Extract<keyof AS, `${number}`> as IsRequired<
      AS[K],
      false
    >]?: AttributeType<AS[K]>;
  }
>;
