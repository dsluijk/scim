import { array, Describe, nonempty, object, union } from "superstruct";

import {
  CanonicalValues,
  ComplexType,
  MultiValued,
  Name,
  Required,
} from "../characteristics";

import { BaseAttributeSchema, baseValidator } from "./base";
import { ReferenceAttributeSchema } from "./reference";

import { SimpleAttributeSchema } from "./simple";

type NonComplexAttributeSchema =
  | SimpleAttributeSchema
  | ReferenceAttributeSchema;

/**
 * The complex attribute.
 *
 * This attribute requires subattributes.
 */
export interface ComplexAttributeSchema<
  N extends Name = Name,
  T extends ComplexType = ComplexType,
  M extends MultiValued = MultiValued,
  R extends Required = Required,
  C extends CanonicalValues = CanonicalValues,
  A extends [NonComplexAttributeSchema, ...NonComplexAttributeSchema[]] = [
    NonComplexAttributeSchema,
    ...NonComplexAttributeSchema[],
  ],
> extends BaseAttributeSchema<N, T, M, R, C> {
  subAttributes: A;
}
export const ComplexAttributeSchema: Describe<ComplexAttributeSchema> = object({
  ...baseValidator,
  type: ComplexType,
  subAttributes: nonempty(
    array(union([SimpleAttributeSchema, ReferenceAttributeSchema])),
  ) as unknown as Describe<
    [NonComplexAttributeSchema, ...NonComplexAttributeSchema[]]
  >,
});
