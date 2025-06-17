# Data Model DDL

A Data Definition Language (DDL) for defining data models in YAML. This tool helps developers and database designers to specify database schemas in a clear, version-controlled format.

## Overview

The Data Model DDL provides a structured way to define database tables, columns, relationships, and constraints using YAML. This approach offers several advantages:

- **Readable**: Easy to understand even for non-technical stakeholders
- **Version-controlled**: Track schema changes over time
- **Validated**: Schema validation prevents common mistakes
- **Portable**: Generate database-specific DDL from a single source of truth
- **Self-documenting**: Includes built-in support for descriptions and metadata

## Installation

```bash
# Install using npm
npm install @dasolve/data-model-ddl

# Or using Bun
bun add @dasolve/data-model-ddl
```

## Usage

Create a `.data-model.yml` file that follows the schema. You can add the YAML language server reference to get schema validation in your editor:

```yaml
# yaml-language-server: $schema=../schemas/data-model-v1.0.0.schema.json
version: "1.0.0"
name: my_database
description: Description of your data model
tables:
  # Define your tables here
```

## Example

Here's an example of a Twitter-like data model:

```yaml
# yaml-language-server: $schema=../schemas/data-model-v1.0.0.schema.json
version: "1.0.0"
name: twitter
description: A Data Model representing a Twitter-like application
tables:
  - name: users
    description: User accounts
    columns:
      - name: id
        type: uuid
        description: User identifier
        primary_key: true
        default: gen_random_uuid()
      - name: username
        type: text
        description: Unique username of the user
        unique: true
      - name: email
        type: text
        description: Unique email address of the user
        unique: true
      - name: created_at
        description: Timestamp when the user was created
        type: datetime
        default: CURRENT_TIMESTAMP()
        nullable: true

  - name: posts
    description: User posts/tweets
    columns:
      - name: id
        type: uuid
        description: Post identifier
        primary_key: true
        default: gen_random_uuid()
      - name: title
        type: text
        description: Title of the post
      - name: body
        type: text
        description: Content of the post
        nullable: false
      - name: status
        type: text
        nullable: false
      - name: created_at
        description: Timestamp when the post was created
        type: datetime
        nullable: false
        default: CURRENT_TIMESTAMP()

  - name: follows
    description: Represents follower relationships between users
    columns:
      - name: following_user_id
        type: uuid
        description: User being followed
        foreign_key:
          table: users
          column: id
      - name: follower_user_id
        description: User who is following another user
        type: uuid
        foreign_key:
          table: users
          column: id
```

## Supported Column Types

The DSL supports various column types:

- **uuid**: Universally Unique Identifier (UUID)
- **text**: Text data of any length
- **integer**: Numeric integer values
- **date**: Date values (without time)
- **datetime**: Date and time values

## Column Properties

Each column can have the following properties:

- **name**: Column name (required)
- **type**: Data type (required)
- **description**: Description of the column's purpose
- **primary_key**: Boolean indicating if the column is a primary key
- **unique**: Boolean indicating if values must be unique
- **nullable**: Boolean indicating if NULL values are allowed
- **default**: Default value expression
- **foreign_key**: Reference to another table's column

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the terms found in the [LICENSE](./LICENSE) file.
