#!/usr/bin/env bun
/**
 * YAML to Drizzle Schema CLI Tool
 *
 * This script takes a path to a YAML data model file and outputs
 * the generated Drizzle schema to the console.
 *
 * Usage:
 *   bun run scripts/loadYAML.ts path/to/data-model.yml
 */

import { generateSchemaFileContent } from "./index";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

// Get the command line arguments
const args = process.argv.slice(2);

/**
 * Main function to process the YAML file and generate Drizzle schema
 */
function main() {
  // Check if a file path was provided
  if (args.length === 0) {
    console.error("Error: No file path provided");
    console.error("Usage: bun run scripts/loadYAML.ts path/to/data-model.yml");
    process.exit(1);
  }

  const inputPath = args[0];

  // Resolve the path relative to the current working directory
  const resolvedPath = resolve(process.cwd(), inputPath);

  // Check if the file exists
  if (!existsSync(resolvedPath)) {
    console.error(`Error: File not found: ${resolvedPath}`);
    process.exit(1);
  }

  try {
    // Read and parse the YAML file
    const fileContent = readFileSync(resolvedPath, "utf-8");
    const parsedContent = parse(fileContent);

    // Generate the Drizzle schema
    const schema = generateSchemaFileContent(parsedContent);

    // Output the schema to console
    console.log(schema);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error processing YAML file: ${error.message}`);

      // Provide more specific error messages based on error type
      if (error.message.includes("parse")) {
        console.error("The YAML file may be invalid. Please check the syntax.");
      } else if (error.message.includes("schema")) {
        console.error(
          "The data model doesn't match the expected schema. Please verify it follows the correct format."
        );
      }
    } else {
      console.error("An unknown error occurred");
    }
    process.exit(1);
  }
}

// Execute the main function
main();
