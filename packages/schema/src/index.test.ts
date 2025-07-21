import { describe, expect, it } from "bun:test";
import schemas from "./index";

describe("Schema Tests", () => {
  it("should export the schema", () => {
    expect(schemas).toMatchSnapshot();
  });
});
