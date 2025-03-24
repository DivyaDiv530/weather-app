import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WeatherForecast, GroupedForecast } from '../weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'fe3695759da76e0c9dcaf566634a08ed';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  selectedCity = signal<string | null>(null);
  groupedForecasts = signal<GroupedForecast[]>([]);
  uniqueTimes = signal<string[]>([]);

  constructor(private http: HttpClient) {}

  changeCity(city: string) {
    this.selectedCity.set(city);
    this.fetchWeather(city);
  }

  fetchWeather(city: string): void {
    this.getWeather(city).subscribe((forecasts) => {
      const grouped = this.groupByDateAndTime(forecasts);
      this.groupedForecasts.set(grouped);
      this.uniqueTimes.set(this.extractUniqueTimes(forecasts));
    });
  }

  private getWeather(city: string): Observable<WeatherForecast[]> {
    return this.http
      .get<any>(`${this.apiUrl}?q=${city}&units=metric&appid=${this.apiKey}`)
      .pipe(
        map((response) =>
          response.list.map((item: any) => ({
            date: item.dt_txt.split(' ')[0],
            time: item.dt_txt.split(' ')[1].slice(0, 5), // Only HH:mm
            temperature: item.main.temp,
            windSpeed: item.wind.speed,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          }))
        )
      );
  }

  private groupByDateAndTime(forecasts: WeatherForecast[]): GroupedForecast[] {
    const grouped: { [key: string]: { [time: string]: WeatherForecast | null } } = {};

    forecasts.forEach((forecast) => {
      const date = forecast.date;
      const time = forecast.time;
      if (!grouped[date]) {
        grouped[date] = {};
      }
      grouped[date][time] = forecast;
    });

    return Object.keys(grouped).map((date) => ({
      date,
      times: Object.keys(grouped[date]),
      forecasts: grouped[date],
    }));
  }

  private extractUniqueTimes(forecasts: WeatherForecast[]): string[] {
    const uniqueTimes = new Set<string>();
    forecasts.forEach((forecast) => uniqueTimes.add(forecast.time));
    return Array.from(uniqueTimes).sort();
  }
}
