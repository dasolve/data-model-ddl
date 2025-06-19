#!/usr/bin/env bun

import { z } from "zod/v4";
import versions from "../src";

for (const version in versions) {
  Bun.write(
    `./schemas/data-model-v${version}.schema.json`,
    JSON.stringify(
      z.toJSONSchema(versions[version as keyof typeof versions], {
        target: "draft-7",
      }),
      undefined,
      2
    )
  );
  console.log(
    `JSON Schema generated and written to data-model-v${version}.schema.json`
  );
}
