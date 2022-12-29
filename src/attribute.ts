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
  optional,
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

type Attribute<
  T extends Type = Type,
  N extends string = string,
  M extends boolean = boolean,
  C extends string = string,
  S extends Attribute = Attribute<Type.string, string, boolean, string, never>,
> = {
  name: N;
  description: string;
  type: T;
  multiValued: M;
  required: boolean;
  canonicalValues: T extends Type.string ? C[] : never;
  caseExact: boolean;
  mutability: Mutability;
  returned: Returned;
  uniqueness: Uniqueness;
  referenceTypes: T extends Type.reference ? string[] : never;
  subAttributes: T extends Type.complex ? S[] : never;
};

const Attribute: Describe<Attribute> = defaulted(
  object({
    name: pattern(string(), /^([A-Za-z][A-Za-z\d$\-_]*)|(\$ref)$/),
    description: nonempty(string()),
    type: enums(Object.values(Type)),
    multiValued: boolean(),
    required: boolean(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canonicalValues: dynamic((_, ctx): any => {
      const type: Type = ctx.branch.at(-2)?.type ?? Type.string;
      if (type === Type.string) {
        return optional(array(nonempty(string())));
      } else {
        return literal(undefined);
      }
    }) as unknown as Describe<Attribute["canonicalValues"]>,
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
    caseExact: false,
    mutability: Mutability.readWrite,
    returned: Returned.default,
    uniqueness: Uniqueness.none,
  },
);

type MakeMulti<T, M extends boolean> = M extends true ? T[] : T;
type AttributeValue<A extends Attribute[]> = A extends Attribute<
  infer T,
  infer N,
  infer M,
  infer C,
  infer S
>[]
  ? {
      [P in N]: {
        string: MakeMulti<string extends C ? string : C, M>;
        boolean: MakeMulti<boolean, M>;
        decimal: MakeMulti<number, M>;
        integer: MakeMulti<number, M>;
        dateTime: MakeMulti<Date, M>;
        binary: MakeMulti<Buffer, M>;
        reference: MakeMulti<never, M>; // TODO
        complex: MakeMulti<{ [k: string]: S }, M>; // TODO
      }[T];
    }
  : never;

export {
  Attribute,
  AttributeValue,
  Type as AttributeType,
  Mutability as AttributeMutability,
  Returned as AttributeReturned,
  Uniqueness as AttributeUniqueness,
};
