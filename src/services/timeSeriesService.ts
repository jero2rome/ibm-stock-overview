import axios from 'axios';
import { buildQueryParams } from '../utils/serviceHelpers';
import { RawTimeSeriesEntry, TimeSeriesData, TimeSeriesMetaData, ApiResponseMetaData, ApiResponse } from '../types/timeSeriesTypes';

export const fetchTimeSeriesDaily = async (
  url: string,
  symbol: string,
  apiKey: string
): Promise<{ metaData: TimeSeriesMetaData, seriesData: TimeSeriesData[] }> => {
  try {
    const response = await axios.get<ApiResponse>(url, {
      params: buildQueryParams('TIME_SERIES_DAILY', symbol, apiKey),
    });

    const metaData = mapToMetaData(response.data['Meta Data']);
    const seriesData = mapToSeriesData(response.data['Time Series (Daily)']);

    return { metaData, seriesData };
  } catch (error) {
    console.error(`Error fetching time series data for ${symbol}:`, error);
    throw new Error(`Failed to fetch time series data for ${symbol}: ${error}`);
  }
};

function mapToMetaData(rawMetaData: ApiResponseMetaData): TimeSeriesMetaData {
  return {
    information: rawMetaData['1. Information'],
    symbol: rawMetaData['2. Symbol'],
    lastRefreshed: rawMetaData['3. Last Refreshed'],
    outputSize: rawMetaData['4. Output Size'],
    timeZone: rawMetaData['5. Time Zone']
  };
}

function mapToSeriesData(rawSeriesData: { [key: string]: RawTimeSeriesEntry }): TimeSeriesData[] {
  return Object.entries(rawSeriesData).map(([date, data]) => ({
    date: new Date(date),
    open: parseFloat(data['1. open']),
    high: parseFloat(data['2. high']),
    low: parseFloat(data['3. low']),
    close: parseFloat(data['4. close']),
    volume: parseFloat(data['5. volume'])
  }));
}
