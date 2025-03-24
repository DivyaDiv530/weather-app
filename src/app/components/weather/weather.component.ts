import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { GroupedForecast } from '../../weather.model';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './weather.component.scss'
})
export class WeatherComponent {
  private weatherService = inject(WeatherService);
  selectedCity = this.weatherService.selectedCity;
  groupedForecasts: Signal<GroupedForecast[]> = this.weatherService.groupedForecasts;
  uniqueTimes: Signal<string[]> = this.weatherService.uniqueTimes;

  cities: string[] = ['Birmingham', 'London', 'Cardiff'];

  changeCity(city:any) {
    if (this.cities.includes(city.target.value)) {
      this.weatherService.changeCity(city.target.value);
    }
  }
}
