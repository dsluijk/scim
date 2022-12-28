import { refine, string } from "superstruct";
import { IsURLOptions } from "validator/es/lib/isURL";

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
