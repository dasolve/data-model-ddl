"""
YAML parser module for Data Model DSL files.

This module is responsible for:
1. Loading YAML files
2. Validating them against the schema
3. Converting them to Pydantic models
"""

import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import yaml
from pydantic import BaseModel, Field, ValidationError, field_validator

# Path to JSON schema file
SCHEMA_PATH = (
    Path(os.path.dirname(os.path.dirname(__file__))) / "schemas" / "data-model-v1.schema.json"
)


def load_yaml_file(file_path: Union[str, Path]) -> Dict[str, Any]:
    """
    Load a YAML file and return its contents as a dictionary.

    Args:
        file_path: Path to the YAML file

    Returns:
        Dictionary containing the YAML file contents

    Raises:
        FileNotFoundError: If the file does not exist
        yaml.YAMLError: If the file cannot be parsed as YAML
    """
    with open(file_path, "r") as f:
        try:
            return yaml.safe_load(f)
        except yaml.YAMLError as e:
            raise ValueError(f"Error parsing YAML file: {e}")


def load_json_schema() -> Dict[str, Any]:
    """
    Load the JSON schema file.

    Returns:
        Dictionary containing the JSON schema

    Raises:
        FileNotFoundError: If the schema file does not exist
        json.JSONDecodeError: If the schema file cannot be parsed as JSON
    """
    try:
        with open(SCHEMA_PATH, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        raise FileNotFoundError(f"Schema file not found at {SCHEMA_PATH}")
    except json.JSONDecodeError as e:
        raise ValueError(f"Error parsing JSON schema: {e}")


# Pydantic models for validation


class ForeignKey(BaseModel):
    """Foreign key definition."""

    table: str
    column: str


class ColumnTypeOptions(BaseModel):
    """Options for complex column types."""

    precision: Optional[int] = None
    scale: Optional[int] = None
    withTimeZone: Optional[bool] = None


class ColumnType(BaseModel):
    """Complex column type with options."""

    name: str
    options: Optional[ColumnTypeOptions] = None


class BaseColumn(BaseModel):
    """Base column definition with common properties."""

    name: str
    description: Optional[str] = None
    nullable: bool = False
    unique: bool = False
    generated_always_as: Optional[str] = None


class UUIDColumn(BaseColumn):
    """UUID column definition."""

    type: str = "uuid"
    default: Optional[str] = None
    primary_key: bool = False
    foreign_key: Optional[ForeignKey] = None

    @field_validator("default")
    def validate_default(cls, v):
        if v and v != "gen_random_uuid()":
            raise ValueError("UUID default must be gen_random_uuid()")
        return v


class IntegerColumn(BaseColumn):
    """Integer column definition."""

    type: str = "integer"
    default: Optional[int] = None
    primary_key: bool = False
    generated_always_as: Optional[str] = None
    foreign_key: Optional[ForeignKey] = None


class NumericColumn(BaseColumn):
    """Numeric column definition."""

    type: ColumnType
    default: Optional[Union[str, float]] = None

    @field_validator("type")
    def validate_type(cls, v):
        if v.name != "numeric":
            raise ValueError("Type name must be 'numeric'")
        return v


class TextColumn(BaseColumn):
    """Text column definition."""

    type: str = "text"
    default: Optional[str] = None


class DateColumn(BaseColumn):
    """Date column definition."""

    type: str = "date"
    default: Optional[str] = None

    @field_validator("default")
    def validate_default(cls, v):
        if v and v != "CURRENT_DATE()":
            raise ValueError("Date default must be CURRENT_DATE()")
        return v


class TimestampColumn(BaseColumn):
    """Timestamp column definition."""

    type: ColumnType
    default: Optional[str] = None

    @field_validator("type")
    def validate_type(cls, v):
        if v.name != "timestamp":
            raise ValueError("Type name must be 'timestamp'")
        return v

    @field_validator("default")
    def validate_default(cls, v):
        if v and v != "now()":
            raise ValueError("Timestamp default must be now()")
        return v


# Union of all column types
Column = Union[UUIDColumn, IntegerColumn, NumericColumn, TextColumn, DateColumn, TimestampColumn]


class Table(BaseModel):
    """Table definition."""

    name: str
    description: Optional[str] = None
    columns: List[Column]


class DataModel(BaseModel):
    """Root data model definition."""

    version: str = "1"
    name: str
    dialect: str = "postgres"
    description: Optional[str] = None
    tables: List[Table]


def parse_data_model(data: Dict[str, Any]) -> DataModel:
    """
    Parse and validate a data model dictionary.

    Args:
        data: Dictionary containing the data model definition

    Returns:
        Validated DataModel instance

    Raises:
        ValidationError: If the data model does not conform to the schema
    """
    try:
        return DataModel.model_validate(data)
    except ValidationError as e:
        raise ValueError(f"Error validating data model: {e}")


def parse_yaml_file(file_path: Union[str, Path]) -> DataModel:
    """
    Parse and validate a YAML data model file.

    Args:
        file_path: Path to the YAML file

    Returns:
        Validated DataModel instance

    Raises:
        FileNotFoundError: If the file does not exist
        ValueError: If the file cannot be parsed or validated
    """
    data = load_yaml_file(file_path)
    return parse_data_model(data)
