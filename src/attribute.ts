import {
  array,
  boolean,
  defaulted,
  Describe,
  enums,
  lazy,
  nonempty,
  object,
  optional,
  pattern,
  refine,
  string,
} from "superstruct";

enum Type {
  string = "string",
  boolean = "boolean",
  decimal = "decimal",
  integer = "integer",
  dateTime = "dateTime",
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

type Attribute = {
  name: string;
  type: Type;
  multiValued: boolean;
  description: string;
  required: boolean;
  canonicalValues: string[];
  caseExact: boolean;
  mutability: Mutability;
  returned: Returned;
  uniqueness: Uniqueness;
  referenceTypes?: (string | "external" | "uri")[];
  subAttributes?: Attribute[];
};

const Attribute: Describe<Attribute> = defaulted(
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
    referenceTypes: refine(
      optional(nonempty(array(nonempty(string())))),
      "onType",
      (v, ctx) => {
        const type: string = ctx.branch.at(-2)?.type ?? "";
        if (v === undefined) {
          if (type === Type.reference) {
            return "Reference attributes require reference types";
          }

          return true;
        }

        if (type !== Type.reference) {
          return "Non-reference attributes cannot contain reference types.";
        }

        return true;
      },
    ),
    subAttributes: refine(
      lazy(() => optional(nonempty(array(Attribute)))),
      "onType",
      (v, ctx) => {
        const type: string = ctx.branch.at(-2)?.type ?? "";
        if (v === undefined) {
          if (type === Type.complex) {
            return "Complex attributes require subattributes";
          }

          return true;
        }

        if (type !== Type.complex) {
          return "Non-complex attributes cannot contain subattributes";
        }

        for (const sub of v) {
          if (sub.type === Type.complex) {
            return "Complex attributes cannot have complex subattributes";
          }
        }

        return true;
      },
    ),
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
