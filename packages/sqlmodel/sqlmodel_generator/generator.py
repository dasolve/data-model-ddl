"""
Generator module for SQLModel schema files.

This module is responsible for:
1. Taking a validated data model
2. Generating SQLModel code based on the model
3. Handling dialect-specific code generation
"""

from pathlib import Path
from typing import Dict, Optional, Union

from sqlmodel_generator.parser import DataModel, parse_yaml_file
from sqlmodel_generator.helpers.yaml_utils import load_yaml_file


def generate_sqlmodel_schema(
    data_model: Union[DataModel, Dict, str, Path], output_file: Optional[Union[str, Path]] = None
) -> str:
    """
    Generate SQLModel schema code from a data model.

    Args:
        data_model: Either a DataModel instance, a dictionary containing the data model,
                   or a path to a YAML file containing the data model.
        output_file: Optional path to write the generated code to.
                    If not provided, the code will only be returned as a string.

    Returns:
        The generated SQLModel schema code.

    Raises:
        ValueError: If the data model is invalid or unsupported.
    """
    # Convert the input to a DataModel instance
    if isinstance(data_model, (str, Path)):
        model = parse_yaml_file(data_model)
    elif isinstance(data_model, dict):
        model = DataModel.model_validate(data_model)
    elif isinstance(data_model, DataModel):
        model = data_model
    else:
        raise ValueError(f"Expected DataModel, dict, str, or Path, got {type(data_model)}")

    # Generate code based on dialect
    if model.dialect.lower() == "postgres":
        from sqlmodel_generator.dialects.postgresql import generate_postgresql_schema

        code = generate_postgresql_schema(model)
    else:
        raise ValueError(f"Unsupported dialect: {model.dialect}")

    # Write to file if requested
    if output_file is not None:
        with open(output_file, "w") as f:
            f.write(code)

    return code
