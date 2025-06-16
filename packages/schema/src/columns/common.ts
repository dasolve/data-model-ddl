import { z } from "zod/v4";

export const tableColumn = z.strictObject({
  name: z
    .string()
    .min(2)
    .max(59)
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/),
  description: z.string().max(255).optional(),
  type: z.enum([
    "integer",
    "uuid",
    "text",
    "date",
    "datetime",
    "boolean",
    "decimal",
    "json",
  ]),
  nullable: z.boolean().default(false).optional(),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
  unique: z.boolean().default(false).optional(),
});
