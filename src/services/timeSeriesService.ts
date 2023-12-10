// src/services/timeSeriesService.ts

import axios from 'axios';
import { RawTimeSeriesEntry, TimeSeriesData, TimeSeriesMetaData } from '../types/timeSeriesTypes';

interface ApiResponse {
  'Meta Data': any;
  'Time Series (Daily)': { [key: string]: RawTimeSeriesEntry };
}

export const fetchTimeSeriesDaily = async (url:string, symbol: string, apiKey: string): Promise<{ metaData: TimeSeriesMetaData, seriesData: TimeSeriesData[] }> => {
  try {
    const response = await axios.get<ApiResponse>(url, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: apiKey
      }
    });

    const timeSeriesData = response.data['Time Series (Daily)'];
    const metaData: TimeSeriesMetaData = {
      information: response.data['Meta Data']['1. Information'],
      symbol: response.data['Meta Data']['2. Symbol'],
      lastRefreshed: response.data['Meta Data']['3. Last Refreshed'],
      outputSize: response.data['Meta Data']['4. Output Size'],
      timeZone: response.data['Meta Data']['5. Time Zone']
    };

    const seriesData: TimeSeriesData[] = Object.entries(timeSeriesData).map(([date, data]) => ({
      date,
      open: data['1. open'],
      high: data['2. high'],
      low: data['3. low'],
      close: data['4. close'],
      volume: data['5. volume']
    }));

    return { metaData, seriesData };
  } catch (error) {
    console.error('Error fetching time series data:', error);
    throw error;
  }
};
