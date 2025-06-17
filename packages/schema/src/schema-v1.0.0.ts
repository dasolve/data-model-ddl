import { z } from "zod/v4";
import {
  integerPrimaryKeyColumn,
  uuidPrimaryKeyColumn,
} from "./columns/primary-keys";
import { integerColumn } from "./columns/numbers";
import { textColumn, uuidForeignKeyColumn } from "./columns/text";
import { dateColumn, datetimeColumn } from "./columns/time";
import { tableColumn } from "./columns/common";

export const schema = z.strictObject({
  version: z.literal("1.0.0").describe("Data Model DDL file version"),
  name: tableColumn.shape.name.meta({ title: "Data Model Name" }),
  dialect: z.enum(["postgres"]).default("postgres").optional().meta({
    title: "Database Dialect",
    description: "The database dialect for which the data model is intended",
  }),
  description: tableColumn.shape.description.meta({
    title: "Data Model Description",
    description: "Can be used to describe the purpose of the data model",
  }),
  tables: z.array(
    z.strictObject({
      name: tableColumn.shape.name.meta({
        title: "Table Name",
      }),
      description: tableColumn.shape.description.meta({
        title: "Table Description",
        description:
          "Can be used to describe the purpose of the table in the data model",
      }),
      columns: z
        .array(
          z.union([
            uuidPrimaryKeyColumn,
            integerPrimaryKeyColumn,
            integerColumn,
            textColumn,
            dateColumn,
            datetimeColumn,
            uuidForeignKeyColumn,
          ])
        )
        .nonempty()
        .max(1600),
    })
  ),
});
