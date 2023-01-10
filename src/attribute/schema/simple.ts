import { Describe, object } from "superstruct";

import {
  CanonicalValues,
  MultiValued,
  Name,
  Required,
  SimpleType,
} from "../characteristics";

import { BaseAttributeSchema, baseValidator } from "./base";

/**
 * Simple attributes.
 *
 * This includes all attribute types except for complex and reference types.
 */
export interface SimpleAttributeSchema<
  N extends Name = Name,
  T extends SimpleType = SimpleType,
  M extends MultiValued = MultiValued,
  R extends Required = Required,
  C extends CanonicalValues = CanonicalValues,
> extends BaseAttributeSchema<N, T, M, R, C> {
  type: T;
}
export const SimpleAttributeSchema: Describe<SimpleAttributeSchema> = object({
  ...baseValidator,
  type: SimpleType,
});
