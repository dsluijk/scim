import {
  Describe,
  nonempty,
  object,
  optional,
  refine,
  string,
  union,
} from "superstruct";

import { dateString, path, url } from "../validation";

/**
 * Metadata for a schema.
 */
export type SchemaMeta = {
  resourceType?: string;
  created?: Date;
  lastModified?: Date;
  location?: string;
  version?: string;
};
export const SchemaMeta: Describe<SchemaMeta> = refine(
  object({
    resourceType: optional(nonempty(string())),
    created: optional(dateString()),
    lastModified: optional(dateString()),
    location: optional(union([url(), path()])),
    version: optional(nonempty(string())),
  }),
  "modifiedDate",
  (meta) => {
    if (!meta.created || !meta.lastModified) {
      return true;
    }

    if (meta.created <= meta.lastModified) {
      return true;
    }

    const diff = meta.created.getTime() - meta.lastModified.getTime();
    return `Expected 'lastModified' to not be before 'created', but 'lastModified' happened ${diff}ms earlier.`;
  },
);
