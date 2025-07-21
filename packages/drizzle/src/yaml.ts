import { parseDataModel } from "./parser";
import { generateDrizzleSchemaFile } from "./generator";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

export const generateSchemaYamlFile = (filePath: string) => {
  const fullPath = join(import.meta.dir, filePath);
  const fileContent = readFileSync(fullPath, "utf-8");
  const parsedContent = parse(fileContent);
  const parsedDataModel = parseDataModel(parsedContent);
  return generateDrizzleSchemaFile(parsedDataModel);
};
