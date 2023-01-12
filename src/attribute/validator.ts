import {
  array,
  boolean,
  Describe,
  enums,
  integer,
  intersection,
  nonempty,
  number,
  object,
  optional,
  string,
  Struct,
  union,
} from "superstruct";

import { base64, dateString, lowercase, schemaUrn, url } from "../validation";

import { AttributeSchema } from "./schema";
import { AttributeType } from "./types";

/**
 * Dynamically create a Superstruct validator based on a attribute schema.
 * Can then be used to validate values for this schema.
 * @param schema The schema to base the validator on.
 * @returns The validator for this schema.
 */
export const createAttributeValidator = <
  AS extends AttributeSchema,
  V extends AttributeType<AS> = AttributeType<AS>,
>(
  schema: AS,
  additionalValidator?: Describe<V>,
): Describe<V> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let validator: Struct<any, unknown>;

  switch (schema.type) {
    case "string":
      // Require one of the canonical values if provided.
      if (schema.canonicalValues.length > 0) {
        validator = enums(schema.canonicalValues);
      } else {
        validator = string();
      }

      // Lowercase strings when not case sensitive.
      if (!schema.caseExact) {
        validator = lowercase(validator);
      }
      break;
    case "boolean":
      validator = boolean();
      break;
    case "decimal":
      validator = number();
      break;
    case "integer":
      validator = integer();
      break;
    case "dateTime":
      validator = dateString();
      break;
    case "binary":
      validator = base64();
      break;
    case "reference":
      validator = union(
        schema.referenceTypes.map((t) => {
          if (t === "external") {
            return url();
          }

          if (t === "uri") {
            return schemaUrn();
          }

          return string();
        }) as [Describe<string>, ...Describe<string>[]],
      );
      break;
    case "complex":
      validator = object(
        schema.subAttributes.reduce((prev, a) => {
          return { ...prev, [a.name]: createAttributeValidator(a) };
        }, {}),
      );
      break;
  }

  if (additionalValidator) {
    validator = intersection([validator, additionalValidator]);
  }

  if (schema.multiValued) {
    validator = array(validator);

    if (schema.required) {
      validator = nonempty(validator);
    }
  } else {
    if (!schema.required) {
      validator = optional(validator);
    }
  }

  return validator as Describe<V>;
};
