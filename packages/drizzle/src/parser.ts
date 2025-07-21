import schema from "@dasolve/dmddl-schema";
import { z } from "zod/v4";

export const dataModelFileSchema = z.looseObject({
  version: z.enum(Object.keys(schema) as Array<keyof typeof schema>),
});

export const parseDataModel = (
  dataModelDefinition: z.infer<typeof dataModelFileSchema>
) => {
  const parsedDataModel = dataModelFileSchema.parse(dataModelDefinition);

  return schema[parsedDataModel.version].parse(parsedDataModel);
};
