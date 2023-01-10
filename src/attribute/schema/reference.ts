import {
  array,
  Describe,
  literal,
  nonempty,
  object,
  string,
  union,
} from "superstruct";

import {
  CanonicalValues,
  MultiValued,
  Name,
  ReferenceType,
  Required,
} from "../characteristics";

import { BaseAttributeSchema, baseValidator } from "./base";

/**
 * Reference attribute type.
 *
 * This add reference types characteristic, which restricts the types of reference it accepts.
 */
export interface ReferenceAttributeSchema<
  N extends Name | "$ref" = Name | "$ref",
  T extends ReferenceType = ReferenceType,
  M extends MultiValued = MultiValued,
  R extends Required = Required,
  C extends CanonicalValues = CanonicalValues,
  RT extends [string, ...string[]] = [string, ...string[]],
> extends BaseAttributeSchema<N, T, M, R, C> {
  referenceTypes: RT;
}
export const ReferenceAttributeSchema: Describe<ReferenceAttributeSchema> =
  object({
    ...baseValidator,
    name: union([Name, literal("$ref")]),
    type: ReferenceType,
    referenceTypes: nonempty(array(string())) as unknown as Describe<
      [string, ...string[]]
    >,
  });
