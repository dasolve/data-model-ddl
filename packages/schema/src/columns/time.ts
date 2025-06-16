import { z } from "zod/v4";
import { tableColumn } from "./common";

export const datetimeColumn = z
  .strictObject({
    ...tableColumn.shape,
    type: z.literal("datetime"),
    default: z
      .union([z.iso.datetime(), z.literal("CURRENT_TIMESTAMP()")])
      .optional(),
  })
  .meta({
    title: "Date column with time",
    description: "Used for storing date and time values.",
  });

export const dateColumn = z
  .strictObject({
    ...tableColumn.shape,
    type: z.literal("date"),
    default: z.iso.date().optional(),
  })
  .meta({
    title: "Date column without time",
    description: "Used for storing date values without time.",
  });
