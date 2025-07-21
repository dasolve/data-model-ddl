import type { schema } from "@dasolve/dmddl-schema/schemas/v1";
import type { z } from "zod/v4";
import { postgresqlGenerateSchemaFile } from "../dialects/postgresql";

export function generate(dataModel: z.infer<typeof schema>) {
  switch (dataModel.dialect) {
    case "postgres": {
      const pgSchema: Parameters<typeof postgresqlGenerateSchemaFile>[0] = {
        name: dataModel.name,
        description: dataModel.description,
        tables: dataModel.tables.map((t) => ({
          name: t.name,
          description: t.description,
          columns: t.columns.map((c) => ({
            name: c.name,
            type: typeof c.type === "string" ? c.type : c.type.name,
            options: typeof c.type !== "string" ? c.type.options : undefined,
            primaryKey: "primary_key" in c && c.primary_key,
            default: "default" in c ? c.default : undefined,
            notNull: "nullable" in c && !c.nullable,
            unique: "unique" in c && c.unique,
            // TODO: Handle check constraints
            // check: "check" in c ? c.check : undefined,
            generatedAlwaysAs:
              "generated_always_as" in c ? c.generated_always_as : undefined,
            foreignKey:
              "foreign_key" in c
                ? {
                    table: c.foreign_key.table,
                    column: c.foreign_key.column,
                  }
                : undefined,
          })),
        })),
      };
      return postgresqlGenerateSchemaFile(pgSchema);
    }
    default: {
      throw new Error(`Unsupported dialect: ${dataModel.dialect}`);
    }
  }
}
