import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherComponent } from './weather.component';
import { WeatherService } from '../../services/weather.service';
import { signal } from '@angular/core';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let mockWeatherService: Partial<WeatherService>;

  beforeEach(async () => {
    mockWeatherService = {
      selectedCity: signal('Birmingham'),
      groupedForecasts: signal([]),
      uniqueTimes: signal(['09:00', '12:00', '15:00']),
      changeCity: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [WeatherComponent],
      providers: [{ provide: WeatherService, useValue: mockWeatherService }],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of cities', () => {
    expect(component.cities).toEqual(['Birmingham', 'London', 'Cardiff']);
  });

  it('should call changeCity when a valid city is selected', () => {
    const cityEvent = { target: { value: 'London' } };
    component.changeCity(cityEvent);
    expect(mockWeatherService.changeCity).toHaveBeenCalledWith('London');
  });

  it('should not call changeCity when an invalid city is selected', () => {
    const cityEvent = { target: { value: 'Unknown City' } };
    component.changeCity(cityEvent);
    expect(mockWeatherService.changeCity).not.toHaveBeenCalled();
  });
});
