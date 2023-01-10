import {
  coerce,
  date,
  instance,
  pattern,
  refine,
  string,
  Struct,
} from "superstruct";
import { IsURLOptions } from "validator/es/lib/isURL";
import { base64 as libBase64 } from "rfc4648";

import validator from "validator";

/**
 * Validate an URL.
 * This requires the protocol to be present by default.
 * @param opt Validator options to customize the validation.
 * @returns A Superstruct struct to validate with.
 */
export const url = (opt?: IsURLOptions) =>
  refine(string(), "url", (v) => {
    if (!validator.isURL(v, { require_protocol: true, ...opt })) {
      return "The provided URL is invalid.";
    }

    return true;
  });

/**
 * Validator for URL paths.
 * Does not allow for query & hex encoded paths.
 * @returns A superstruct struct to validate the paths.
 */
export const path = () =>
  pattern(string(), /^(\/|((\/([\w\-~:@!$&'()*+,;=]|(\.(?!\.)))*)+))$/);

/**
 * Parses a string as a date.
 * You should use `create` with this, as only then you'll get the parsed date.
 * @returns A superstruct struct to validate the string with.
 */
export const dateString = () =>
  coerce(date(), string(), (date) => new Date(date));

/**
 * Validates that a string is a valid base64 string.
 * @returns A superstruct struct to validate the base64 with.
 */
const base64string = () =>
  refine(string(), "base64 string", (v) => {
    try {
      libBase64.parse(v);
      return true;
    } catch {
      return "Invalid base64 string.";
    }
  });

/**
 * Parses a base64 encoded string to binary.
 * This transforms the encoded data to an Int Array.
 * @returns A superstruct struct to coerce with.
 */
export const base64 = () =>
  coerce(uint8array(), base64string(), (b) => libBase64.parse(b));

/**
 * Uint8Array validator for Superstruct.
 * @returns A superstruct struct to validate the Int Array with.
 */
export const uint8array = () => instance(Uint8Array);

/**
 * Transforms a string to a lowercase version.
 * This is only used on strings, using non-strings is a NOP.
 * Note: literal and enums structs should have lowercased values.
 * @param struct The superstruct validator which returns a string.
 * @returns A superstruct struct to validate the lowercased string with.
 */
export const lowercase = <T extends string, S>(struct: Struct<T, S>) =>
  coerce(struct, string(), (s) => s.toLowerCase());

/**
 * Validator for the SCIM schema URN.
 * This is pretty strict.
 * @returns A Superstruct struct to be used while validating.
 */
export const schemaUrn = () =>
  refine(string(), "schemaUrn", (v) => {
    if (!v.startsWith("urn:ietf:params:scim:")) {
      return "The URN does not start with the Namespace Specific String.";
    }

    const nsRegex = /^[0-9A-Za-z()+,\-:.=@;$_!*']+$/;
    if (!nsRegex.test(v)) {
      return `URN ${v} contains invalid characters.`;
    }

    const split = v.split(":");
    if (split.length < 6) {
      return "The URN doesn't have the correct amount of namespaces.";
    }

    const type = split[4];
    const name = split[5];
    const other = split.slice(6).join(":");

    if (type !== "schemas" && type !== "api" && type !== "param") {
      return "The URN type is invalid.";
    }

    const allowedCoreSchemaNames = [
      "2.0:User",
      "2.0:Group",
      "2.0:ServiceProviderConfig",
      "2.0:ResourceType",
      "2.0:Schema",
    ];
    const allowedApiNames: string[] = [];
    const allowedParamNames: string[] = [];

    if (
      type === "schemas" &&
      name === "core" &&
      !allowedCoreSchemaNames.includes(other)
    ) {
      return `Core Schema URN name '${other}' is not allowed.`;
    }

    if (type === "api" && !allowedApiNames.includes(name)) {
      return `Api URN name '${name}' is not allowed.`;
    }

    if (type === "param" && !allowedParamNames.includes(name)) {
      return `Param URN name '${name}' is not allowed.`;
    }

    return true;
  });
