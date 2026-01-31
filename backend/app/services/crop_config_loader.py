"""
Crop Configuration Loader for CropMind AI.
Loads crop-specific lifecycle configurations from YAML files.
"""
import yaml
import os
from typing import Dict, List, Any, Optional
from functools import lru_cache


class CropConfigLoader:
    """
    Loads and manages crop lifecycle configurations from YAML files.
    Supports multiple crop types with different growth stages and durations.
    """
    
    def __init__(self, config_path: str):
        """
        Initialize the crop config loader.
        
        Args:
            config_path: Path to the crop configuration YAML file
        """
        self.config_path = config_path
        self._config = None
        self._load_config()
    
    def _load_config(self) -> None:
        """Load the crop configuration from YAML file"""
        if not os.path.exists(self.config_path):
            raise FileNotFoundError(
                f"Crop configuration file not found: {self.config_path}"
            )
        
        try:
            with open(self.config_path, 'r', encoding='utf-8') as file:
                self._config = yaml.safe_load(file)
        except yaml.YAMLError as e:
            raise ValueError(f"Failed to parse crop configuration YAML: {e}")
        
        if not self._config or 'crops' not in self._config:
            raise ValueError("Invalid crop configuration: 'crops' key not found")
    
    def get_crop_config(self, crop_type: str) -> Dict[str, Any]:
        """
        Get configuration for a specific crop type.
        
        Args:
            crop_type: The crop type (e.g., 'wheat', 'rice', 'cotton', 'sugarcane')
        
        Returns:
            Dictionary containing crop configuration with stages and total_days
        
        Raises:
            ValueError: If crop type is not found in configuration
        """
        crop_type_lower = crop_type.lower()
        
        if crop_type_lower not in self._config['crops']:
            available = ", ".join(self._config['crops'].keys())
            raise ValueError(
                f"Crop type '{crop_type}' not found in configuration. "
                f"Available crops: {available}"
            )
        
        return self._config['crops'][crop_type_lower]
    
    def get_crop_stages(self, crop_type: str) -> List[Dict[str, Any]]:
        """
        Get lifecycle stages for a specific crop type.
        
        Args:
            crop_type: The crop type
        
        Returns:
            List of stage dictionaries
        """
        config = self.get_crop_config(crop_type)
        return config.get('stages', [])
    
    def get_total_days(self, crop_type: str) -> int:
        """
        Get total lifecycle days for a crop type.
        
        Args:
            crop_type: The crop type
        
        Returns:
            Total number of days in the crop lifecycle
        """
        config = self.get_crop_config(crop_type)
        return config.get('total_days', 120)  # Default 120 if not specified
    
    def get_current_stage(self, crop_type: str, day_count: int) -> Optional[Dict[str, Any]]:
        """
        Determine the current growth stage based on day count.
        
        Args:
            crop_type: The crop type
            day_count: Number of days since sowing
        
        Returns:
            Current stage dictionary or None
        """
        stages = self.get_crop_stages(crop_type)
        
        for stage in stages:
            if stage['start_day'] <= day_count < stage['end_day']:
                return stage
        
        # If beyond all stages, return last stage
        if stages and day_count >= stages[-1]['end_day']:
            return stages[-1]
        
        return None
    
    def get_stage_label(self, crop_type: str, day_count: int) -> str:
        """
        Get the label for the current growth stage.
        
        Args:
            crop_type: The crop type
            day_count: Number of days since sowing
        
        Returns:
            Stage label string
        """
        stage = self.get_current_stage(crop_type, day_count)
        return stage['label'] if stage else "Unknown"
    
    def calculate_progress_percentage(self, crop_type: str, day_count: int) -> float:
        """
        Calculate progress percentage for the crop lifecycle.
        
        Args:
            crop_type: The crop type
            day_count: Number of days since sowing
        
        Returns:
            Progress percentage (0-100)
        """
        total_days = self.get_total_days(crop_type)
        return min((day_count / total_days) * 100, 100.0)
    
    def get_available_crops(self) -> List[str]:
        """
        Get list of all available crop types in the configuration.
        
        Returns:
            List of crop type names
        """
        return list(self._config['crops'].keys())


@lru_cache()
def get_crop_loader(config_path: str = "app/config/crop_config.yaml") -> CropConfigLoader:
    """
    Get cached crop config loader instance.
    
    Args:
        config_path: Path to crop configuration file
    
    Returns:
        CropConfigLoader instance
    """
    return CropConfigLoader(config_path)
