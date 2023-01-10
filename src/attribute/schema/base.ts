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
} from "../characteristics";

/**
 * Base attribute, with all shared characteristics.
 *
 * Not used directly, but used to create the types of attributes.
 */
export interface BaseAttributeSchema<
  N extends Name = Name,
  T extends Type = Type,
  M extends MultiValued = MultiValued,
  R extends Required = Required,
  C extends CanonicalValues = CanonicalValues,
> {
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
}

/**
 * Base validator of all shared characteristics.
 *
 * Used to create the validators of the types of attributes.
 */
export const baseValidator = {
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
};
