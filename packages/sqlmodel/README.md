# SQLModel Generator

A library to generate SQLModel schema files from Data Model DSL YAML files, similar to the Drizzle generator.

## Installation

```bash
# Install using uv
uv pip install -e .
```

## Usage

### Command Line

You can use the generator from the command line with the `uv run` command:

```bash
# Generate schema to stdout
cd packages/sqlmodel && uv run -m dmddl_sqlmodel.cli path/to/model.yml

# Generate schema to a file
cd packages/sqlmodel && uv run -m dmddl_sqlmodel.cli path/to/model.yml -o output.py
```

### Using the Helper Script

For convenience, you can use the provided shell script:

```bash
# Make sure the script is executable
chmod +x packages/sqlmodel/scripts/generate.sh

# Generate schema to stdout
packages/sqlmodel/scripts/generate.sh path/to/model.yml

# Generate schema to a file
packages/sqlmodel/scripts/generate.sh path/to/model.yml output.py
```

### As a Library

You can also use the generator as a library in your Python code:

```python
from dmddl_sqlmodel.generator import generate_sqlmodel_schema

# Generate schema from a YAML file
code = generate_sqlmodel_schema('path/to/model.yml')
print(code)

# Generate schema and write to a file
generate_sqlmodel_schema('path/to/model.yml', 'output.py')
```

## Testing

Run tests using moonrepo:

```bash
moon run sqlmodel:test
```

## Features

- Converts Data Model DSL YAML files to SQLModel schema files
- Supports all column types defined in the schema
- Handles proper type mapping to SQLModel/SQLAlchemy types
- Generates SQLModel classes with appropriate Field definitions
- Supports PostgreSQL dialect

## Example

Input YAML:

```yaml
version: "1"
name: "basic_example"
dialect: "postgres"
description: "A basic example data model with a few tables"

tables:
  - name: "users"
    description: "User accounts"
    columns:
      - name: "id"
        type: "uuid"
        default: "gen_random_uuid()"
        primary_key: true
      - name: "username"
        type: "text"
        unique: true
```

Generated SQLModel code:

```python
import datetime
import uuid
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel
from sqlalchemy import Column, String, Integer, Numeric, DateTime, Date, UUID
from sqlalchemy.dialects.postgresql import UUID as PGUUID

"""
A basic example data model with a few tables
"""

class Users(SQLModel, table=True):
    """User accounts"""
    id: UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    username: String = Field(unique=True)
```
