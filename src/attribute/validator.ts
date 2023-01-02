import {
  any,
  array,
  boolean,
  Describe,
  enums,
  integer,
  number,
  optional,
  string,
  Struct,
} from "superstruct";

import { base64, dateString, lowercase } from "../validation";

import { AttributeSchema } from "./schema";
import { AttributeType } from "./types";

/**
 * Type for a Superstruct validator of an attribute schema.
 */
export type AttributeValidator<AS extends AttributeSchema> = Describe<
  AttributeType<AS>
>;

/**
 * Dynamically create a Superstruct validator based on a attribute schema.
 * Can then be used to validate values for this schema.
 * @param schema The schema to base the validator on.
 * @returns The validator for this schema.
 */
export const attributeValidator = <AS extends AttributeSchema>(
  schema: AS,
): AttributeValidator<AS> => {
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
      validator = any(); // TODO
      break;
    case "complex":
      validator = any(); // TODO
      break;
  }

  if (schema.multiValued) {
    validator = array(validator);
  }

  if (!schema.required) {
    validator = optional(validator);
  }

  // TODO schema.referenceTypes
  // TODO schema.subAttributes

  return validator as AttributeValidator<AS>;
};
