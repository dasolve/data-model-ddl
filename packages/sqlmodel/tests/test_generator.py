"""
Tests for the SQLModel generator.
"""

import os
from pathlib import Path


from dmddl_sqlmodel.parser import parse_yaml_file
from dmddl_sqlmodel.generator import generate_sqlmodel_schema


# Get the path to the test fixtures
FIXTURES_DIR = Path(os.path.dirname(__file__)) / "fixtures"


def test_parse_basic_yaml():
    """Test parsing a basic YAML file."""
    basic_yaml = FIXTURES_DIR / "basic.yml"
    data_model = parse_yaml_file(basic_yaml)

    # Check basic properties
    assert data_model.version == "1"
    assert data_model.name == "basic_example"
    assert data_model.dialect == "postgres"
    assert data_model.description == "A basic example data model with a few tables"

    # Check tables
    assert len(data_model.tables) == 2

    # Check users table
    users_table = data_model.tables[0]
    assert users_table.name == "users"
    assert len(users_table.columns) == 4

    # Check id column in users table
    id_column = users_table.columns[0]
    assert id_column.name == "id"
    assert id_column.type == "uuid"
    assert id_column.default == "gen_random_uuid()"
    assert id_column.primary_key is True

    # Check posts table
    posts_table = data_model.tables[1]
    assert posts_table.name == "posts"
    assert len(posts_table.columns) == 6

    # Check foreign key in posts table
    user_id_column = posts_table.columns[3]
    assert user_id_column.name == "user_id"
    assert user_id_column.type == "uuid"
    assert user_id_column.foreign_key.table == "users"
    assert user_id_column.foreign_key.column == "id"


def test_generate_sqlmodel_schema():
    """Test generating SQLModel schema code."""
    basic_yaml = FIXTURES_DIR / "basic.yml"
    code = generate_sqlmodel_schema(basic_yaml)

    # Check that the code contains expected SQLModel imports
    assert "from sqlmodel import Field, Relationship, SQLModel" in code

    # Check class definitions
    assert "class Users(SQLModel, table=True):" in code
    assert "class Posts(SQLModel, table=True):" in code

    # Check column definitions
    assert "id: UUID = Field(primary_key=True, default_factory=uuid.uuid4)" in code
    assert 'user_id: UUID = Field(foreign_key="Users.id")' in code

    # Check relationship definition (if implemented)
    # This would be an additional feature to implement
    # assert "posts: List[\"Posts\"] = Relationship(back_populates=\"user\")" in code
