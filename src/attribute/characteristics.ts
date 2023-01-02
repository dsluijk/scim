import {
  array,
  boolean,
  defaulted,
  Describe,
  enums,
  nonempty,
  pattern,
  string,
} from "superstruct";

import { lowercase } from "../validation";

/**
 * Different options when there are a limited amount of choices for certain charateristics.
 */
const TypeOptions = [
  "string",
  "boolean",
  "decimal",
  "integer",
  "dateTime",
  "binary",
  "reference",
  "complex",
] as const;
const MutabilityOptions = [
  "readOnly",
  "readWrite",
  "immutable",
  "writeOnly",
] as const;
const ReturnedOptions = ["always", "never", "default", "request"] as const;
const UniquenessOptions = ["none", "server", "global"] as const;

/**
 * The name of the attribute.
 *
 * This is REQUIRED.
 */
export type Name = string;
export const Name: Describe<Name> = nonempty(
  lowercase(pattern(string(), /^([A-Za-z][A-Za-z\d$\-_]*)|(\$ref)$/)),
);

/**
 * The data type, automatically adding basic validation.
 *
 * Defaults to `string`.
 */
export type Type = typeof TypeOptions[number];
export const Type = defaulted(enums(TypeOptions), "string");

/**
 * Whenether the attribute accepts multiple values.
 * Setting this to true makes the attribute an array of the `type`.
 *
 * This is REQUIRED.
 */
export type MultiValued = boolean;
export const MultiValued: Describe<MultiValued> = boolean();

/**
 * A short description of the attribute.
 *
 * Defaults to an empty string.
 */
export type Description = string;
export const Description: Describe<Description> = defaulted(string(), "");

/**
 * If this attribute is required to be specified when creating.
 * For the server implementation the library checks this requirement already.
 *
 * Defaults to `false`.
 */
export type Required = boolean;
export const Required: Describe<Required> = defaulted(boolean(), false);

/**
 * Canonical values of the attribute.
 * This implementation limits the values of the attributes
 * An empty array indicates that there are no canonical values.
 *
 * Defaults to an empty array.
 */
export type CanonicalValues = string[];
export const CanonicalValues: Describe<CanonicalValues> = defaulted(
  array(string()),
  [],
);

/**
 * If the attribute is case-sensitive, only applies to strings.
 * Set to true to make it case-sensitive.
 * This implementation lowercases case-insensitive values.
 *
 * Defaults to `false`.
 */
export type CaseExact = boolean;
export const CaseExact: Describe<CaseExact> = defaulted(boolean(), false);

/**
 * The mutability of the attribute.
 *
 * Defaults to `readWrite`.
 */
export type Mutability = typeof MutabilityOptions[number];
export const Mutability: Describe<Mutability> = defaulted(
  enums(MutabilityOptions),
  "readWrite",
);

/**
 * When to return this attribute with a request.
 *
 * Defaults to `default`.
 */
export type Returned = typeof ReturnedOptions[number];
export const Returned: Describe<Returned> = defaulted(
  enums(ReturnedOptions),
  "default",
);

/**
 * Indicates the uniqueness of the value of the attribute.
 * This implementation does not check this automatically!
 *
 * Defaults to `none`.
 */
export type Uniqueness = typeof UniquenessOptions[number];
export const Uniqueness: Describe<Uniqueness> = defaulted(
  enums(UniquenessOptions),
  "none",
);
