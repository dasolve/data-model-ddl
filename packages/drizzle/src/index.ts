import { z } from "zod/v4";
import { parseDataModel, type dataModelFileSchema } from "./parser";
import { generateDrizzleSchemaFile } from "./generator";

export const generateSchemaFileContent = (
  dataModelDefinition: z.infer<typeof dataModelFileSchema>
) => {
  const parsedDataModel = parseDataModel(dataModelDefinition);
  return generateDrizzleSchemaFile(parsedDataModel);
};
