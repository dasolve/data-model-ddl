import { z } from "zod/v4";
import { tableColumn } from "./common";

export const datetimeColumn = z
  .strictObject({
    ...tableColumn.omit({ generated_always_as: true }).shape,
    type: z.strictObject({
      name: z.literal("timestamp"),
      options: z.strictObject({
        withTimeZone: z.boolean().default(true),
      }),
    }),
    default: z.literal("now()").optional(),
  })
  .meta({
    title: "Date column with time",
    description: "Used for storing date and time values.",
  });

export const dateColumn = z
  .strictObject({
    ...tableColumn.omit({ generated_always_as: true }).shape,
    type: z.literal("date"),
    default: z.literal("CURRENT_DATE()").optional(),
  })
  .meta({
    title: "Date column without time",
    description: "Used for storing date values without time.",
  });
