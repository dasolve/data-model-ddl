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

export const integerForeignKeyColumn = z
  .strictObject({
    ...tableColumn.omit({ unique: true, default: true }).shape,
    type: z.literal("integer"),
    foreign_key: z.strictObject({
      table: tableColumn.shape.name,
      column: tableColumn.shape.name,
    }),
  })
  .meta({
    title: "Integer foreign key column",
    description:
      "Used for identifying a row in another table with an integer. It references a column in another table.",
  });
