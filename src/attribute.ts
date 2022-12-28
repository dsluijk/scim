import {
  array,
  boolean,
  defaulted,
  enums,
  Infer,
  nonempty,
  object,
  pattern,
  string,
} from "superstruct";

export enum AttributeType {
  string = "string",
  boolean = "boolean",
  decimal = "decimal",
  integer = "integer",
  dateTime = "dateTime",
  reference = "reference",
  complex = "complex",
}

export enum AttributeMutability {
  readOnly = "readOnly",
  readWrite = "readWrite",
  immutable = "immutable",
  writeOnly = "writeOnly",
}

export enum AttributeReturned {
  always = "always",
  never = "never",
  default = "default",
  request = "request",
}

export enum AttributeUniqueness {
  none = "none",
  server = "server",
  global = "global",
}

export const Attribute = defaulted(
  object({
    name: pattern(string(), /^([A-Za-z][A-Za-z\d$\-_]*)|(\$ref)$/),
    description: nonempty(string()),
    type: enums(Object.values(AttributeType)),
    multiValued: boolean(),
    required: boolean(),
    canonicalValues: array(nonempty(string())),
    caseExact: boolean(),
    mutability: enums(Object.values(AttributeMutability)),
    returned: enums(Object.values(AttributeReturned)),
    uniqueness: enums(Object.values(AttributeUniqueness)),
  }),
  {
    type: AttributeType.string,
    required: false,
    canonicalValues: [],
    caseExact: false,
    mutability: AttributeMutability.readWrite,
    returned: AttributeReturned.default,
    uniqueness: AttributeUniqueness.none,
  },
);
export type Attribute = Infer<typeof Attribute>;
