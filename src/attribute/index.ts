import { create } from "superstruct";

import { AttributeSchema, createAttributeSchema } from "./schema";
import { AttributeType, AttributeTypes } from "./types";
import { attributeValidator, AttributeValidator } from "./validator";

/**
 * Attribute used in a SCIM schema.
 * Provide a attribute schema with the characteristics of the attribute to create it.
 * A validator of the attribute is created automatically.
 */
class Attribute<AS extends AttributeSchema> {
  private validator: AttributeValidator<AS>;

  public constructor(partialSchema: Partial<AS>) {
    const schema = createAttributeSchema(partialSchema);
    this.validator = attributeValidator(schema);
  }

  public validate(value: unknown): AttributeType<AS> {
    return create(value, this.validator);
  }
}

export { Attribute, AttributeSchema, AttributeType, AttributeTypes };
