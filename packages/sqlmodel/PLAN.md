# SQLModel Generator Implementation Plan

This document outlines the plan for implementing a Python library that converts the Data Model DSL YAML format to SQLModel schema files, similar to the existing Drizzle generator.

## 1. Project Overview

The goal is to create a Python library that:

- Reads data model YAML files based on the JSON schema
- Validates them against the schema
- Generates SQLModel-compatible Python code
- Supports PostgreSQL dialect initially

### 1.1. Important considerations

- The project uses uv as the dependency manager for Python projects. The command to update is `uv sync --all-packages`
- For validation, moonrepo is the task orchestrator that must be used. The command for validation is `moon ci`.

## 2. Detailed Implementation Plan

### 2.1. Project Setup

- Update `pyproject.toml` with necessary dependencies:
  - SQLModel
  - PyYAML
  - Pydantic
  - Click (for CLI)
- Set up project structure following Python best practices

### 2.2. Core Components

- Create a parser module that reads the YAML data model files
- Implement a schema validator based on the JSON schema
- Develop a generator module to transform the validated schema into SQLModel code
- Create dialect-specific handlers (starting with PostgreSQL)

### 2.3. Implementation Phases

#### Phase 1: Parser Implementation

- Create a schema validator using Pydantic
- Implement YAML file reading and parsing

#### Phase 2: Core Generator

- Create the base generator framework
- Implement version handling

#### Phase 3: PostgreSQL Dialect

- Implement specific PostgreSQL type mapping for SQLModel
- Handle PostgreSQL-specific features

#### Phase 4: CLI and Entry Point

- Create a CLI interface for easy usage
- Implement the main entry point

#### Phase 5: Testing

- Create test cases based on example schema files
- Implement unit tests for each component
- Add integration tests

## 3. Proposed File Structure

```
packages/sqlmodel/
├── pyproject.toml       # Dependencies and project metadata
├── README.md            # Documentation
├── dmddl_sqlmodel/  # Main package
│   ├── __init__.py      # Package exports
│   ├── cli.py           # Command line interface
│   ├── parser.py        # YAML parsing and validation
│   ├── generator.py     # Main generator orchestration
│   ├── dialects/        # Dialect-specific code
│   │   ├── __init__.py
│   │   └── postgresql.py # PostgreSQL-specific generator
│   ├── schemas/         # Schema definitions
│   │   ├── __init__.py
│   │   └── v1.py        # V1 schema definition
│   └── helpers/         # Utility functions
│       ├── __init__.py
│       └── utils.py     # Common utilities
└── tests/              # Test suite
    ├── __init__.py
    ├── fixtures/       # Test data
    │   └── sample.yml  # Sample schema files
    └── test_*.py       # Test modules
```

## 4. Implementation Details

### 4.1. SQLModel Mapping Considerations

- Map the schema column types to SQLModel field types
- Handle relationships (foreign keys)
- Support PostgreSQL-specific types and features
- Generate SQLModel table classes with proper metadata

### 4.2. Key Technical Components

- Pydantic models for schema validation
- Type mapping from schema to SQLModel
- Code generation templating
- CLI for user interaction

### 4.3. Type Mapping Reference

| Data Model Type | SQLModel/SQLAlchemy Type |
| --------------- | ------------------------ |
| uuid            | UUID                     |
| integer         | Integer                  |
| numeric         | Numeric                  |
| text            | String                   |
| date            | Date                     |
| timestamp       | DateTime                 |
