import { generate as generate_v1 } from "./generators/v1";
import type { parseDataModel } from "./parser";

export const generateDrizzleSchemaFile = (
  dataModel: ReturnType<typeof parseDataModel>
) => {
  switch (dataModel.version) {
    case "1":
      return generate_v1(dataModel);
    default:
      throw new Error(`Unsupported data model version: ${dataModel.version}.`);
  }
};
