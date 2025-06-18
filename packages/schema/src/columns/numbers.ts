import { z } from "zod/v4";
import { tableColumn } from "./common";

export const integerColumn = z
  .strictObject({
    ...tableColumn.shape,
    type: z.literal("integer"),
    default: z.int().max(Number.MAX_SAFE_INTEGER).optional(),
    nullable: z.boolean().default(false),
  })
  .meta({ title: "Integer column" });

export const decimalNumberColumn = z
  .strictObject({
    ...tableColumn.shape,
    type: z.strictObject({
      name: z.literal("numeric"),
      options: z.strictObject({
        precision: z.number().min(0).max(1000),
        scale: z.number().min(0).max(1000),
      }),
    }),
    default: z.union([z.string(), z.number()]).optional(),
  })
  .meta({
    title: "Decimal number column",
    description: "Used for storing decimal numbers with a fixed precision.",
  });
