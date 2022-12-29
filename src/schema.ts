import {
  array,
  Describe,
  nonempty,
  object,
  optional,
  string,
  union,
} from "superstruct";

import { dateString, path, url } from "./validation";
import { Attribute } from "./attribute";

export type Schema = {
  id: string;
  name?: string;
  description?: string;
  meta?: {
    resourceType?: string;
    created?: Date;
    lastModified?: Date;
    location?: string;
    version?: string;
  };
  attributes: Attribute[];
};
export const Schema: Describe<Schema> = object({
  id: nonempty(string()),
  name: optional(nonempty(string())),
  description: optional(nonempty(string())),
  meta: optional(
    object({
      resourceType: optional(nonempty(string())),
      created: optional(dateString()),
      lastModified: optional(dateString()),
      location: optional(union([url(), path()])),
      version: optional(string()),
    }),
  ),
  attributes: nonempty(array(Attribute)),
});
