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
    date: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
  }
  