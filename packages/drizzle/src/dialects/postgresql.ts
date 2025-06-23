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
  generatedAlwaysAs?: string | "identity";
  foreignKey?: {
    table: string;
    column: string;
  };
};

const drizzleORMImports = new Set<string>();
const pgCoreImports = new Set<string>(["pgSchema"]);

function importStatement(variables: Set<string>, moduleName: string) {
  if (variables.size === 0) return undefined;
  const imports = Array.from(variables).join(", ");
  return `import { ${imports} } from "${moduleName}";\n`;
}

function tsdocDescription(field: Column | Table | PGSchema) {
  return field.description ? `/** ${field.description} */` : undefined;
}

function pgDefaultValue(
  type: "uuid" | "integer" | "numeric" | "timestamp" | "text" | (string & {}),
  value: "gen_random_uuid()" | string | number | boolean | undefined
) {
  if (value === undefined) return undefined;
  switch (type) {
    case "uuid":
      if (value === "gen_random_uuid()") return `.defaultRandom()`;
      throw new Error(`Invalid default value for UUID column: ${value}.`);
    case "numeric":
    case "integer":
      if (typeof value === "number") return `.default(${value})`;
      throw new Error(
        `Invalid default value for numeric/integer column: ${value}. Expected a number.`
      );
    case "timestamp":
      if (value === "now()") return `.defaultNow()`;
      throw new Error(
        `Invalid default value for timestamp column: ${value}. Expected 'now()'.`
      );
    case "text":
      if (typeof value === "string") return `.default("${value}")`;
      throw new Error(
        `Invalid default value for text column: ${value}. Expected a string.`
      );
    default:
      throw new Error("Invalid type for default value: " + type);
  }
}

function pgGeneratedAlwaysAs(
  type: "uuid" | "integer" | "numeric" | "timestamp" | (string & {}),
  value: "identity" | undefined | (string & {})
) {
  if (value === undefined) return undefined;
  switch (type) {
    case "integer":
      if (value === "identity") return `.generatedAlwaysAsIdentity()`;
      throw new Error(
        `Invalid generated always as value for integer column: ${value}.`
      );
    default:
      throw new Error("Invalid type for generated always as: " + type);
  }
}

function pgColumn(column: Column) {
  pgCoreImports.add(column.type);
  const options = column.options && printObject(column.options);
  const type = `${column.type}("${column.name}"${options ? `, ${options}` : ""})`;
  const pk = column.primaryKey && ".primaryKey()";
  const defaultValue = pgDefaultValue(column.type, column.default);
  const notNull = column.notNull && ".notNull()";
  const unique = column.unique && ".unique()";
  const references =
    column.foreignKey &&
    `.references(() => ${column.foreignKey.table}.${column.foreignKey.column})`;
  const generatedAlwaysAs = pgGeneratedAlwaysAs(
    column.type,
    column.generatedAlwaysAs
  );
  return [
    type,
    pk,
    defaultValue,
    notNull,
    unique,
    references,
    generatedAlwaysAs,
  ]
    .filter(Boolean)
    .join("");
}

function pgTable(schema: string, table: Table) {
  const { name, columns } = table;
  return `${tsdocDescription(table)}
export const ${snakeToCamel(name)} = ${snakeToCamel(schema)}.table("${name}", {
  ${columns
    .map((c) =>
      [tsdocDescription(c), `${c.name}: ${pgColumn(c)}`]
        .filter(Boolean)
        .join("\n ")
    )
    .join(",\n  ")}
});
`;
}

export function postgresqlGenerateSchemaFile(schema: PGSchema) {
  const schemaDefinition = `const ${snakeToCamel(schema.name)} = pgSchema("${schema.name}");\n`;

  const tableDefinitions = schema.tables.map((t) => pgTable(schema.name, t));

  return [
    importStatement(drizzleORMImports, "drizzle-orm"),
    importStatement(pgCoreImports, "drizzle-orm/pg-core"),
    tsdocDescription(schema),
    schemaDefinition,
    ...tableDefinitions,
  ]
    .filter(Boolean)
    .join("\n");
}
