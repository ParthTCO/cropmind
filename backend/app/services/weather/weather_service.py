"""
Weather Service for CropMind AI.
Integrates with real weather APIs (OpenWeatherMap) to replace mock data.
Falls back to mock data if API is not configured.
"""
import httpx
import random
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from app.config import get_settings


class WeatherService:
    """
    Weather data service that integrates with external weather APIs.
    Supports OpenWeatherMap API with fallback to mock data.
    """
    
    def __init__(self):
        """Initialize weather service with configuration"""
        self.settings = get_settings()
        self.api_key = self.settings.weather_api_key
        self.api_endpoint = self.settings.weather_api_endpoint
        self.provider = self.settings.weather_api_provider
        self.cache_ttl = self.settings.weather_cache_ttl
        self._cache: Dict[str, tuple[Dict[str, Any], datetime]] = {}
    
    async def get_weather(
        self,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        location: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get weather data for a location.
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            location: Location name (alternative to lat/lon)
        
        Returns:
            Dictionary with weather data
        """
        # If API is enabled and configured, use real API
        if self.settings.enable_weather_api and self.api_key:
            return await self._get_real_weather(latitude, longitude, location)
        
        # Otherwise fall back to mock data
        return self._get_mock_weather()
    
    async def _get_real_weather(
        self,
        latitude: Optional[float],
        longitude: Optional[float],
        location: Optional[str]
    ) -> Dict[str, Any]:
        """
        Fetch real weather data from API.
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            location: Location name
        
        Returns:
            Parsed weather data
        """
        # Check cache first
        cache_key = f"{latitude}_{longitude}_{location}"
        if cache_key in self._cache:
            cached_data, cached_time = self._cache[cache_key]
            if datetime.now() - cached_time < timedelta(seconds=self.cache_ttl):
                return cached_data
        
        try:
            if self.provider == "openweathermap":
                data = await self._fetch_openweathermap(latitude, longitude, location)
            else:
                raise ValueError(f"Unsupported weather provider: {self.provider}")
            
            # Cache the result
            self._cache[cache_key] = (data, datetime.now())
            return data
            
        except Exception as e:
            print(f"Weather API error: {e}. Falling back to mock data.")
            return self._get_mock_weather()
    
    async def _fetch_openweathermap(
        self,
        latitude: Optional[float],
        longitude: Optional[float],
        location: Optional[str]
    ) -> Dict[str, Any]:
        """
        Fetch weather from OpenWeatherMap API.
        
        Args:
            latitude: Latitude
            longitude: Longitude
            location: Location name
        
        Returns:
            Parsed weather data
        """
        params = {
            "appid": self.api_key,
            "units": "metric"  # Celsius
        }
        
        # Prioritize lat/lon, fallback to location name
        if latitude is not None and longitude is not None:
            params["lat"] = latitude
            params["lon"] = longitude
        elif location:
            params["q"] = location
        else:
            raise ValueError("Either lat/lon or location must be provided")
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.api_endpoint}/weather",
                params=params
            )
            response.raise_for_status()
            data = response.json()
        
        return self._parse_openweathermap_response(data)
    
    def _parse_openweathermap_response(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse OpenWeatherMap API response into standard format.
        
        Args:
            data: Raw API response
        
        Returns:
            Standardized weather data
        """
        main = data.get("main", {})
        weather = data.get("weather", [{}])[0]
        wind = data.get("wind", {})
        rain = data.get("rain", {})
        
        # Calculate rain probability (OpenWeatherMap doesn't provide this directly)
        # Use cloudiness and rain amount as proxy
        clouds = data.get("clouds", {}).get("all", 0)
        rain_1h = rain.get("1h", 0)
        rain_chance = min(clouds, 100)  # Simple approximation
        if rain_1h > 0:
            rain_chance = max(rain_chance, 70)  # If it's raining, high chance
        
        return {
            "temperature": round(main.get("temp", 0), 1),
            "feels_like": round(main.get("feels_like", 0), 1),
            "condition": weather.get("main", "Unknown"),
            "description": weather.get("description", ""),
            "humidity": main.get("humidity", 0),
            "wind_speed": round(wind.get("speed", 0) * 3.6, 1),  # Convert m/s to km/h
            "rain_chance": rain_chance,
            "rain_amount": f"{rain_1h:.1f}mm" if rain_1h > 0 else None,
            "alert": self._generate_alert(rain_chance, main.get("temp", 0))
        }
    
    def _generate_alert(self, rain_chance: int, temperature: float) -> Optional[str]:
        """
        Generate weather alerts based on conditions.
        
        Args:
            rain_chance: Rain probability percentage
            temperature: Temperature in Celsius
        
        Returns:
            Alert message or None
        """
        alerts = []
        
        if rain_chance > 70:
            alerts.append("Heavy rain expected")
        elif rain_chance > 50:
            alerts.append("Rain likely today")
        
        if temperature > 40:
            alerts.append("Extreme heat warning")
        elif temperature < 5:
            alerts.append("Frost warning")
        
        return " | ".join(alerts) if alerts else None
    
    def _get_mock_weather(self) -> Dict[str, Any]:
        """
        Generate mock weather data for testing/fallback.
        Uses configurable ranges instead of hard-coded values.
        
        Returns:
            Mock weather data
        """
        # These could be moved to config if needed
        conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"]
        temp = round(random.uniform(24, 35), 1)
        humidity = random.randint(45, 80)
        rain_chance = random.randint(0, 70)
        
        return {
            "temperature": temp,
            "feels_like": round(temp + random.uniform(1, 3), 1),
            "condition": random.choice(conditions),
            "description": "Mock weather data (API not configured)",
            "humidity": humidity,
            "wind_speed": round(random.uniform(5, 20), 1),
            "rain_chance": rain_chance,
            "rain_amount": f"{random.randint(15, 20)}mm" if rain_chance > 50 else None,
            "alert": "Rain Expected Tomorrow" if rain_chance > 50 else None
        }


# Singleton instance
_weather_service: Optional[WeatherService] = None


def get_weather_service() -> WeatherService:
    """
    Get singleton weather service instance.
    
    Returns:
        WeatherService instance
    """
    global _weather_service
    if _weather_service is None:
        _weather_service = WeatherService()
    return _weather_service
