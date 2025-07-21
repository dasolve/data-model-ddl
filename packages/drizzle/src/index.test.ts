import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";
import { parse as parseYAML } from "yaml";
import { generateSchemaFileContent } from "./index";

// Utility function to load a YAML fixture from the fixtures directory
function loadFixture(fixtureName: string) {
  const fixturePath = join(import.meta.dir, "../fixtures", fixtureName);
  const fixtureContent = readFileSync(fixturePath, "utf-8");
  return parseYAML(fixtureContent);
}

describe("Drizzle Schema Generator", () => {
  test("should generate schema for basic table", () => {
    const fixture = loadFixture("basic-table.yml");
    const result = generateSchemaFileContent(fixture);
    expect(result).toMatchSnapshot();
  });

  test("should generate schema with relationships", () => {
    const fixture = loadFixture("relationships.yml");
    const result = generateSchemaFileContent(fixture);
    expect(result).toMatchSnapshot();
  });

  test("should generate schema with various column types", () => {
    const fixture = loadFixture("column-types.yml");
    const result = generateSchemaFileContent(fixture);
    expect(result).toMatchSnapshot();
  });

  test("should generate schema with constraints", () => {
    const fixture = loadFixture("constraints.yml");
    const result = generateSchemaFileContent(fixture);
    expect(result).toMatchSnapshot();
  });

  test("should generate schema with constraints (generated always as)", () => {
    const fixture = loadFixture("constraints-pk.yml");
    const result = generateSchemaFileContent(fixture);
    expect(result).toMatchSnapshot();
  });

  test("should handle errors for invalid inputs", () => {
    const fixture = loadFixture("invalid.yml");
    expect(() => generateSchemaFileContent(fixture)).toThrow();
  });

  test("should handle errors for invalid dialects", () => {
    const fixture = loadFixture("invalid-dialect.yml");
    expect(() => generateSchemaFileContent(fixture)).toThrow();
  });

  test("should handle errors for invalid uuid defaults", () => {
    const fixture = loadFixture("invalid-uuid-default.yml");
    expect(() => generateSchemaFileContent(fixture)).toThrow();
  });
});
