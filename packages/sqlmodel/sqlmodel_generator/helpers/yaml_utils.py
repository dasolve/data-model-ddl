"""
Utility functions for handling YAML files.
"""

import os
from pathlib import Path
from typing import Any, Dict, Union

import yaml


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


def find_schema_file(version: str = "v1") -> Path:
    """
    Find the JSON schema file for the specified version.

    Args:
        version: Schema version (default: "v1")

    Returns:
        Path to the schema file

    Raises:
        FileNotFoundError: If the schema file cannot be found
    """
    # Determine package root directory
    package_root = Path(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    
    # First look in the schema package
    schema_package_path = package_root.parent / "schema" / "schemas" / f"data-model-{version}.schema.json"
    
    if schema_package_path.exists():
        return schema_package_path
    
    # If not found, check in the sqlmodel package
    schema_path = package_root / "schemas" / f"data-model-{version}.schema.json"
    
    if schema_path.exists():
        return schema_path
    
    raise FileNotFoundError(
        f"Schema file not found at {schema_package_path} or {schema_path}"
    )
