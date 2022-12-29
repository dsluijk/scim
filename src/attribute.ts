import {
  array,
  boolean,
  defaulted,
  Describe,
  dynamic,
  enums,
  literal,
  nonempty,
  object,
  pattern,
  string,
} from "superstruct";

enum Type {
  string = "string",
  boolean = "boolean",
  decimal = "decimal",
  integer = "integer",
  dateTime = "dateTime",
  binary = "binary",
  reference = "reference",
  complex = "complex",
}

enum Mutability {
  readOnly = "readOnly",
  readWrite = "readWrite",
  immutable = "immutable",
  writeOnly = "writeOnly",
}

enum Returned {
  always = "always",
  never = "never",
  default = "default",
  request = "request",
}

enum Uniqueness {
  none = "none",
  server = "server",
  global = "global",
}

type Attribute<T extends Type = Type, C extends string = never> = {
  name: string;
  description: string;
  type: T;
  multiValued: boolean;
  required: boolean;
  canonicalValues: C[];
  caseExact: boolean;
  mutability: Mutability;
  returned: Returned;
  uniqueness: Uniqueness;
  referenceTypes: T extends Type.reference ? string[] : never;
  subAttributes: T extends Type.complex ? Attribute[] : never;
};

const Attribute: Describe<Attribute<Type, string>> = defaulted(
  object({
    name: pattern(string(), /^([A-Za-z][A-Za-z\d$\-_]*)|(\$ref)$/),
    description: nonempty(string()),
    type: enums(Object.values(Type)),
    multiValued: boolean(),
    required: boolean(),
    canonicalValues: array(nonempty(string())),
    caseExact: boolean(),
    mutability: enums(Object.values(Mutability)),
    returned: enums(Object.values(Returned)),
    uniqueness: enums(Object.values(Uniqueness)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    referenceTypes: dynamic((_, ctx): any => {
      const type: Type = ctx.branch.at(-2)?.type ?? Type.string;
      if (type === Type.reference) {
        return nonempty(array(nonempty(string())));
      } else {
        return literal(undefined);
      }
    }) as unknown as Describe<Attribute["referenceTypes"]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subAttributes: dynamic((_, ctx): any => {
      const type: Type = ctx.branch.at(-2)?.type ?? Type.string;
      if (type === Type.complex) {
        return nonempty(array(Attribute));
      } else {
        return literal(undefined);
      }
    }) as unknown as Describe<Attribute["subAttributes"]>,
  }),
  {
    type: Type.string,
    required: false,
    canonicalValues: [],
    caseExact: false,
    mutability: Mutability.readWrite,
    returned: Returned.default,
    uniqueness: Uniqueness.none,
  },
);

export {
  Attribute,
  Type as AttributeType,
  Mutability as AttributeMutability,
  Returned as AttributeReturned,
  Uniqueness as AttributeUniqueness,
};
