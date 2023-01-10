import { create } from "superstruct";

import { AttributeType, AttributeTypes } from "./types";
import { AttributeValidator, createAttributeValidator } from "./validator";
import { AttributeSchema } from "./schema";

/**
 * Attribute used in a SCIM schema.
 *
 * Provide a attribute schema with the characteristics of the attribute to create it.
 * A validator of the attribute is created automatically.
 */
export class Attribute<AS extends AttributeSchema> {
  private schema: AS;
  private validator: AttributeValidator<AS>;

  /**
   * Create the attribute based on it's schema.
   *
   * You may omit characteristics with defaults.
   * The schema is automatically validated.
   * @param partialSchema The schema to create the attribute with.
   * @throws {SchemaMeta} when the schema provided is not valid for SCIM.
   */
  public constructor(partialSchema: Partial<AS>) {
    this.schema = create(partialSchema, AttributeSchema) as AS;
    this.validator = createAttributeValidator(this.schema);
  }

  /**
   * Validate a value against this attribute.
   * @param value the value to validate.
   * @throws {StructError} when the value is not valid for this attribute.
   * @returns The validated attribute.
   */
  public validate(value: unknown): AttributeType<AS> {
    return create(value, this.validator);
  }
}

export { AttributeSchema, AttributeType, AttributeTypes };
