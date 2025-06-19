import { z } from "zod/v4";
import { tableColumn } from "./common";

export const textColumn = z
  .strictObject({
    ...tableColumn.shape,
    type: z.literal("text"),
    default: z.string().optional(),
    generated_always_as: z.string().optional(),
  })
  .meta({
    title: "Text column",
    description: "Used for storing text content regardless of size.",
  });
