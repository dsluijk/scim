import {
  array,
  Describe,
  nonempty,
  object,
  optional,
  string,
} from "superstruct";

import { AttributeSchema } from "../attribute";

import { SchemaMeta } from "./meta";

/**
 * SCIM schema definiton.
 */
export type Schema<AS extends Array<AttributeSchema> = AttributeSchema[]> = {
  id: string;
  name?: string;
  description?: string;
  meta?: SchemaMeta;
  attributes: AS;
};
export const Schema: Describe<Schema> = object({
  id: nonempty(string()),
  name: optional(nonempty(string())),
  description: optional(nonempty(string())),
  meta: optional(SchemaMeta),
  attributes: nonempty(array(AttributeSchema)),
});
