"""
Command-line interface for the SQLModel generator.
"""

import argparse
import sys

from dmddl_sqlmodel.generator import generate_sqlmodel_schema


def main():
    """
    Main entry point for the command-line interface.
    """
    parser = argparse.ArgumentParser(
        description="Generate SQLModel schema files from Data Model DSL YAML files."
    )

    parser.add_argument(
        "input_file",
        type=str,
        help="Path to the input YAML file containing the data model definition.",
    )

    parser.add_argument(
        "-o",
        "--output",
        type=str,
        help="Path to the output Python file. If not provided, the code will be printed to stdout.",
    )

    parser.add_argument(
        "--dialect",
        type=str,
        default="postgres",
        choices=["postgres"],
        help="Database dialect to use. Currently only 'postgres' is supported.",
    )

    args = parser.parse_args()

    try:
        # Generate schema
        code = generate_sqlmodel_schema(args.input_file, args.output)

        # Print to stdout if no output file was provided
        if args.output is None:
            print(code)

        return 0
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
