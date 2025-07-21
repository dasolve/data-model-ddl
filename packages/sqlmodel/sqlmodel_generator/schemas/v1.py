"""
Schema definition for v1 of the data model.
"""

from typing import Dict, List, Optional, Union

from pydantic import BaseModel, Field


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

    type: str
    default: Optional[str] = None
    primary_key: bool = False
    foreign_key: Optional[ForeignKey] = None


class IntegerColumn(BaseColumn):
    """Integer column definition."""

    type: str
    default: Optional[int] = None
    primary_key: bool = False
    generated_always_as: Optional[str] = None
    foreign_key: Optional[ForeignKey] = None


class NumericColumn(BaseColumn):
    """Numeric column definition."""

    type: ColumnType
    default: Optional[Union[str, float]] = None


class TextColumn(BaseColumn):
    """Text column definition."""

    type: str
    default: Optional[str] = None


class DateColumn(BaseColumn):
    """Date column definition."""

    type: str
    default: Optional[str] = None


class TimestampColumn(BaseColumn):
    """Timestamp column definition."""

    type: ColumnType
    default: Optional[str] = None


# Union of all column types for type annotation
ColumnTypes = Union[
    UUIDColumn, IntegerColumn, NumericColumn, TextColumn, DateColumn, TimestampColumn
]


class Table(BaseModel):
    """Table definition."""

    name: str
    description: Optional[str] = None
    columns: List[ColumnTypes]


class DataModel(BaseModel):
    """Root data model definition."""

    version: str
    name: str
    dialect: str = "postgres"
    description: Optional[str] = None
    tables: List[Table]


# The schema as a variable that can be imported
schema = DataModel
