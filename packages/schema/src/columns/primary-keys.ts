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
    ...tableColumn.omit({ unique: true, nullable: true }).shape,
    type: z.literal("integer"),
    primary_key: z.boolean().default(true),
    auto_increment: z.boolean().default(true),
  })
  .meta({
    title: "Integer identifier column",
    description:
      "Used for identifying a record uniquely in the table with auto-incrementing integer",
  });
