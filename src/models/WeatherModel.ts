/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IWeather {
  currentCondition: ICurrentCondition
  hourlyConditions: IHourlyCondition[]
  dailyConditions: IDailyCondition[]
}

export interface ICurrentCondition {
  temperature: number
  feelsLike: number
  pressure: number
  humidity: number
  windSpeed: number
  windGusts: number
  description: string
  descriptionId: number
  cloudPercentage: number
  uvIndex: number
}

export interface IHourlyCondition {
  time: string
  temperature: number
  feelsLike: number
  pressure: number
  humidity: number
  dewPoint: number
  cloudPercentage: number
  windSpeed: number
  windGusts: number
  description: string
  descriptionId: number
}

export interface IDailyCondition {
  time: string
  sunrise: string
  sunset: string
  summary: string
  temp: ITemp
  feelsLike: IFeelsLike
  pressure: number
  humidity: number
  windSpeed: number
  windGusts: number
  description: string
  descriptionId: number
  cloudPercentage: number
  uvIndex: number
}

export interface ITemp {
  day: number
  min: number
  max: number
  night: number
  eve: number
  morn: number
}

export interface IFeelsLike {
  day: number
  min: any
  max: any
  night: number
  eve: number
  morn: number
}
