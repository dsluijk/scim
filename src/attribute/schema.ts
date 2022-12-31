import {
  array,
  create,
  Describe,
  object,
  optional,
  unknown,
} from "superstruct";

import {
  CanonicalValues,
  CaseExact,
  Description,
  MultiValued,
  Mutability,
  Name,
  Required,
  Returned,
  Type,
  Uniqueness,
} from "./characteristics";

/**
 * The schema for an attribute definition.
 * Note: This is different from a schema which contains attributes!
 */
export type AttributeSchema<
  N extends Name = Name,
  T extends Type = Type,
  M extends MultiValued = MultiValued,
  R extends Required = Required,
  C extends CanonicalValues = CanonicalValues,
> = {
  name: N;
  type: T;
  multiValued: M;
  description: Description;
  required: R;
  canonicalValues: C;
  caseExact: CaseExact;
  mutability: Mutability;
  returned: Returned;
  uniqueness: Uniqueness;
  subAttributes?: unknown[]; //todo
  referenceTypes?: unknown[]; //todo
};
export const AttributeSchema: Describe<AttributeSchema> = object({
  name: Name,
  type: Type,
  multiValued: MultiValued,
  description: Description,
  required: Required,
  canonicalValues: CanonicalValues,
  caseExact: CaseExact,
  mutability: Mutability,
  returned: Returned,
  uniqueness: Uniqueness,
  subAttributes: optional(array(unknown())), //todo
  referenceTypes: optional(array(unknown())), //todo
});

/**
 * Validate and create an attribute schema from a (partial) definition.
 * Automatically fills in characteristics with a default.
 * @param as The schema for the attribute to create.
 * @throws {StructError} if the schema is invalid.
 * @returns The created attribute schema.
 */
export const createAttributeSchema = <AS extends AttributeSchema>(
  as: Partial<AS>,
): AS => {
  return create(as, AttributeSchema) as AS;
};
