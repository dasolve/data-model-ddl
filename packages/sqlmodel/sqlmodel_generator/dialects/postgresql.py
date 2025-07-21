"""
PostgreSQL dialect implementation for SQLModel schema generation.
"""

from typing import Any, Dict, Optional, Union

from sqlmodel_generator.parser import DataModel, Table


def map_pg_type_to_sqlmodel(
    column_type: Union[str, Dict[str, Any], Any], options: Optional[Dict[str, Any]] = None
) -> str:
    """
    Map PostgreSQL column types to SQLModel/SQLAlchemy types.

    Args:
        column_type: Column type from the data model
        options: Type options if applicable

    Returns:
        SQLAlchemy type string to use in the model
    """
    # Initialize options to empty dict if None
    options_dict: Dict[str, Any] = {}

    if isinstance(column_type, dict):
        base_type = column_type["name"]
        opt = column_type.get("options", {})
        options_dict = opt if opt is not None else {}
    elif hasattr(column_type, "name"):
        # Handle ColumnType objects from Pydantic models
        base_type = column_type.name
        options_obj = getattr(column_type, "options", None)

        # Convert Pydantic model to dict or use empty dict if None
        if options_obj is not None:
            if hasattr(options_obj, "model_dump"):
                # Pydantic v2 style
                options_dict = options_obj.model_dump()
            elif hasattr(options_obj, "dict"):
                # Pydantic v1 style
                options_dict = options_obj.dict()
    else:
        base_type = column_type
        options_dict = options or {}

    if base_type == "uuid":
        return "UUID"
    elif base_type == "integer":
        return "Integer"
    elif base_type == "numeric":
        precision = options_dict.get("precision")
        scale = options_dict.get("scale")
        if precision is not None and scale is not None:
            return f"Numeric(precision={precision}, scale={scale})"
        return "Numeric"
    elif base_type == "text":
        return "String"
    elif base_type == "date":
        return "Date"
    elif base_type == "timestamp":
        with_tz = options_dict.get("withTimeZone", True)
        if with_tz:
            return "DateTime(timezone=True)"
        return "DateTime"
    elif base_type == "datetime":
        # Handle datetime which is not in the schema but used in examples
        return "DateTime"
    else:
        # Fall back to the base type as a string
        if isinstance(base_type, str):
            return base_type.capitalize()
        return str(base_type).capitalize()


def generate_sqlmodel_class(table: Table) -> str:
    """
    Generate SQLModel class code for a table.

    Args:
        table: Table definition

    Returns:
        SQLModel class code
    """
    lines = []

    # Class definition with docstring
    if table.description:
        lines.append(f"class {table.name.capitalize()}(SQLModel, table=True):")
        lines.append(f'    """{table.description}"""')
    else:
        lines.append(f"class {table.name.capitalize()}(SQLModel, table=True):")

    # Table name if different from class name
    if table.name.lower() != table.name.capitalize().lower():
        lines.append(f'    __tablename__ = "{table.name}"')

    # Add columns
    if not table.columns:
        lines.append("    pass")
        return "\n".join(lines)

    for column in table.columns:
        col_name = column.name

        # Handle type
        col_type = column.type
        sa_type = map_pg_type_to_sqlmodel(col_type)

        # Build field definition
        field_args = []

        # Primary key
        if hasattr(column, "primary_key") and column.primary_key:
            field_args.append("primary_key=True")

        # Nullable
        if hasattr(column, "nullable"):
            if column.nullable:
                # SQLModel fields are optional by default, so we only need to add this for clarity
                field_args.append("nullable=True")

        # Default value
        if hasattr(column, "default") and column.default is not None:
            # Handle special defaults
            if column.default == "gen_random_uuid()":
                field_args.append("default_factory=uuid.uuid4")
            elif column.default == "now()":
                field_args.append("default_factory=datetime.datetime.now")
            elif column.default == "CURRENT_DATE()":
                field_args.append("default_factory=datetime.date.today")
            else:
                # Handle regular defaults
                if isinstance(column.default, str):
                    field_args.append(f'default="{column.default}"')
                else:
                    field_args.append(f"default={column.default}")

        # Unique constraint
        if hasattr(column, "unique") and column.unique:
            field_args.append("unique=True")

        # Foreign key
        if hasattr(column, "foreign_key") and column.foreign_key:
            fk_table = column.foreign_key.table.capitalize()
            fk_col = column.foreign_key.column
            field_args.append(f'foreign_key="{fk_table}.{fk_col}"')

        # Generate the field line
        field_def = f"    {col_name}: {sa_type}"

        if field_args:
            field_def += f" = Field({', '.join(field_args)})"

        # Add description as a comment if available
        if hasattr(column, "description") and column.description:
            field_def += f"  # {column.description}"

        lines.append(field_def)

    return "\n".join(lines)


def generate_postgresql_schema(model: DataModel) -> str:
    """
    Generate SQLModel schema code for PostgreSQL.

    Args:
        model: Data model definition

    Returns:
        Generated SQLModel schema code
    """
    lines = []

    # Standard imports
    lines.append("import datetime")
    lines.append("import uuid")
    lines.append("from typing import List, Optional")
    lines.append("")
    lines.append("from sqlmodel import Field, Relationship, SQLModel")
    lines.append("from sqlalchemy import Column, String, Integer, Numeric, DateTime, Date, UUID")
    lines.append("from sqlalchemy.dialects.postgresql import UUID as PGUUID")
    lines.append("")

    # Add model docstring if description available
    if model.description:
        lines.append('"""')
        lines.append(model.description)
        lines.append('"""')
        lines.append("")

    # Generate model classes
    for table in model.tables:
        lines.append(generate_sqlmodel_class(table))
        lines.append("")  # Empty line between classes

    return "\n".join(lines)
