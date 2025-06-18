import { printObject } from "../helpers/printObject";
import { snakeToCamel } from "../helpers/snakeToCamel";

type PGSchema = {
  name: string;
  description?: string;
  tables: Table[];
};

type Table = {
  name: string;
  columns: Column[];
  description?: string;
};

type Column = {
  name: string;
  type: string;
  options?: Record<string, string | number | boolean>;
  description?: string;
  primaryKey?: boolean;
  default?: string | number;
  notNull?: boolean;
  unique?: boolean;
  check?: string;
};

function pgColumnDescription(column: Column) {
  return column.description ? `/** ${column.description} */\n` : undefined;
}

function pgColumn(column: Column) {
  const options = column.options && printObject(column.options);
  const type = `${column.type}("${column.name}"${options ? `, ${options}` : ""})`;
  const pk = column.primaryKey && ".primaryKey()";
  const defaultValue = column.default && `.default(${column.default})`;
  const notNull = column.notNull && ".notNull()";
  const unique = column.unique && ".unique()";
  const check = column.check && `.check(${column.check})`;
  return [type, pk, defaultValue, notNull, unique, check, ";"]
    .filter(Boolean)
    .join();
}

function pgTable(schema: string, { name, columns }: Table) {
  return `export const ${snakeToCamel(name)} = ${schema}.table("${name}", {
  ${columns
    .map((c) =>
      [pgColumnDescription(c), `${c.name}: ${pgColumn(c)}`]
        .filter(Boolean)
        .join("\n ")
    )
    .join(",\n  ")}
});`;
}

export function postgresqlGenerateSchemaFile(schema: PGSchema) {
  const schemaDefinition = `export const ${snakeToCamel(schema.name)} = pgSchema("${schema.name}");`;

  const tableDefinitions = schema.tables.map((t) => pgTable(schema.name, t));

  return [schemaDefinition, ...tableDefinitions].join("\n");
}
