import { z } from "zod/v4";
import { tableColumn } from "./common";

export const textColumn = z
  .strictObject({
    ...tableColumn.shape,
    type: z.literal("text"),
    default: z.string().optional(),
  })
  .meta({
    title: "Text column",
    description: "Used for storing text content regardless of size.",
  });

export const uuidForeignKeyColumn = z
  .strictObject({
    ...tableColumn.omit({ unique: true, default: true }).shape,
    type: z.literal("uuid"),
    foreign_key: z.strictObject({
      table: tableColumn.shape.name,
      column: tableColumn.shape.name,
    }),
  })
  .meta({
    title: "UUID foreign key column",
    description:
      "Used for identifying a row in another table with UUID v4. It references a column in another table.",
  });
