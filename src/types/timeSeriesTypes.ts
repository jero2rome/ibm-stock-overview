// src/types/timeSeriesTypes.ts

export interface TimeSeriesMetaData {
  information: string;
  symbol: string;
  lastRefreshed: string;
  outputSize: string;
  timeZone: string;
}

export interface RawTimeSeriesEntry {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
  '5. volume': string;
}

export interface TimeSeriesData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ApiResponseMetaData {
  '1. Information': string;
  '2. Symbol': string;
  '3. Last Refreshed': string;
  '4. Output Size': string;
  '5. Time Zone': string;
}

export interface ApiResponse {
  'Meta Data': ApiResponseMetaData;
  'Time Series (Daily)': { [key: string]: RawTimeSeriesEntry };
}
