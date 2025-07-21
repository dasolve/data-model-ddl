import { z } from "zod/v4";

const columnTypes = z.enum([
  "integer",
  "uuid",
  "text",
  "date",
  "datetime",
  "boolean",
  "numeric",
  "json",
]);

export const tableColumn = z.strictObject({
  name: z
    .string()
    .min(2)
    .max(59)
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/),
  description: z.string().max(255).optional(),
  type: z.union([
    columnTypes,
    z.strictObject({
      name: columnTypes,
      options: z.record(z.string(), z.string()),
    }),
  ]),
  nullable: z.boolean().default(false).optional(),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
  unique: z.boolean().default(false).optional(),
  // TODO: add check constraints
  // check: z.string().optional(),
  generated_always_as: z.union([z.string(), z.literal("identity")]).optional(),
});
