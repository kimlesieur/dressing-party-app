import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  city: string;
}

interface WeatherAPIResponse {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  location: {
    name: string;
  };
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);

  // Get user's current location
  const getCurrentLocation = async (): Promise<Coordinates> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (coords: Coordinates) => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('Weather API key not found');
      }

      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${coords.latitude},${coords.longitude}&aqi=no`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data: WeatherAPIResponse = await response.json();
      
      setWeather({
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        city: data.location.name
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch weather');
    }
  };

  // Fetch weather by city name (fallback)
  const fetchWeatherByCity = async (city: string = 'Paris') => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('Weather API key not found');
      }

      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data: WeatherAPIResponse = await response.json();
      
      setWeather({
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        city: data.location.name
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch weather');
    }
  };

  useEffect(() => {
    const initializeWeather = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to get current location first
        const coords = await getCurrentLocation();
        setLocation(coords);
        await fetchWeatherByCoords(coords);
        
      } catch (locationError) {
        console.warn('Location error, falling back to default city:', locationError);
        
        // Fallback to default city if location fails
        try {
          await fetchWeatherByCity('Paris');
        } catch (weatherError) {
          setError('Unable to fetch weather data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeWeather();
  }, []);

  // Function to manually refresh weather
  const refreshWeather = async () => {
    setIsLoading(true);
    setError(null);
    
    if (location) {
      await fetchWeatherByCoords(location);
    } else {
      await fetchWeatherByCity('Paris');
    }
    
    setIsLoading(false);
  };

  return { 
    weather, 
    isLoading, 
    error, 
    location,
    refreshWeather 
  };
}; 