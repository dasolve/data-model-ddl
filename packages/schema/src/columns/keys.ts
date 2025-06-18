import { z } from "zod/v4";
import { tableColumn } from "./common";

export const uuidPrimaryKeyColumn = z
  .strictObject({
    ...tableColumn.omit({ unique: true, nullable: true }).shape,
    type: z.literal("uuid"),
    primary_key: z.boolean().default(true),
    default: z.literal("gen_random_uuid()"),
  })
  .meta({
    title: "UUID identifier column",
    description:
      "Used for identifying a record uniquely in the table with UUID v4",
  });

export const integerPrimaryKeyColumn = z
  .strictObject({
    ...tableColumn.omit({ unique: true, nullable: true, default: true }).shape,
    type: z.literal("serial"),
    primary_key: z.boolean().default(true),
  })
  .meta({
    title: "Integer identifier column",
    description:
      "Used for identifying a record uniquely in the table with auto-incrementing integer",
  });

export const integerForeignKeyColumn = z
  .strictObject({
    ...tableColumn.omit({ unique: true, default: true, check: true }).shape,
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

export const uuidForeignKeyColumn = z
  .strictObject({
    ...tableColumn.omit({ unique: true, default: true, check: true }).shape,
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
