export interface WeatherForecast {
    date: string;
    time: string;
    temperature: number;
    windSpeed: number;
    description: string;
    icon: string;
  }
  
  export interface GroupedForecast {
    date: string;
    times: string[];
    forecasts: { [time: string]: WeatherForecast | null };
  }
  