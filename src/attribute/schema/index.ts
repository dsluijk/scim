import { Describe, dynamic } from "superstruct";

import {
  CanonicalValues,
  ComplexType,
  MultiValued,
  Name,
  ReferenceType,
  Required,
  SimpleType,
  Type,
} from "../characteristics";

import { ComplexAttributeSchema } from "./complex";
import { ReferenceAttributeSchema } from "./reference";
import { SimpleAttributeSchema } from "./simple";

/**
 * Schema of an attribute.
 *
 * This describes the attribute with it's characteristics.
 */
export type AttributeSchema<
  N extends Name = Name,
  T extends Type = Type,
  M extends MultiValued = MultiValued,
  R extends Required = Required,
  C extends CanonicalValues = CanonicalValues,
  A extends T extends "complex"
    ? [SimpleAttributeSchema, ...SimpleAttributeSchema[]]
    : never = T extends "complex"
    ? [SimpleAttributeSchema, ...SimpleAttributeSchema[]]
    : never,
  RT extends T extends "reference"
    ? [string, ...string[]]
    : never = T extends "reference" ? [string, ...string[]] : never,
> = T extends ComplexType
  ? ComplexAttributeSchema<N, T & ComplexType, M, R, C, A>
  : T extends ReferenceType
  ? ReferenceAttributeSchema<N, T & ReferenceType, M, R, C, RT>
  : SimpleAttributeSchema<N, T & SimpleType, M, R, C>;
// Superstruct is not smart enough to deal with strongly typed dynamic validators.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AttributeSchema: Describe<AttributeSchema> = dynamic((v): any => {
  const type =
    v && typeof v === "object" && "type" in v && typeof v.type === "string"
      ? v.type
      : "string";

  if (type === "complex") {
    return ComplexAttributeSchema;
  }

  if (type === "reference") {
    return ReferenceAttributeSchema;
  }

  return SimpleAttributeSchema;
}) as unknown as Describe<AttributeSchema>;
