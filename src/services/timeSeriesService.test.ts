import axios from 'axios';
import { fetchTimeSeriesDaily } from './timeSeriesService';
import { RawTimeSeriesEntry, TimeSeriesMetaData } from '../types/timeSeriesTypes';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchTimeSeriesDaily', () => {
  const mockUrl = 'http://mock-api.com';
  const mockSymbol = 'IBM';
  const mockApiKey = 'demo';

  const mockTimeSeriesMetaData: TimeSeriesMetaData = {
    information: 'Daily Time Series with Splits and Dividend Events',
    symbol: 'IBM',
    lastRefreshed: '2023-12-10',
    outputSize: 'Compact',
    timeZone: 'US/Eastern'
  };

const mockRawTimeSeriesEntry: { [key: string]: RawTimeSeriesEntry } = {
  '2023-12-10': {
    '1. open': '100.00',
    '2. high': '105.00',
    '3. low': '95.00',
    '4. close': '102.50',
    '5. volume': '300000'
  },
  '2023-12-09': {
    '1. open': '101.00',
    '2. high': '106.00',
    '3. low': '96.00',
    '4. close': '103.00',
    '5. volume': '250000'
  },
};

  it('should fetch and process time series data successfully', async () => {
    const mockResponse = {
      data: {
        'Meta Data': { mockTimeSeriesMetaData },
        'Time Series (Daily)': {mockRawTimeSeriesEntry}
      }
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    axios.get = jest.fn().mockResolvedValue(mockResponse);

    const result = await fetchTimeSeriesDaily(mockUrl, mockSymbol, mockApiKey);

    expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: 'IBM',
        apikey: 'demo'
      }
    });
    expect(result).toHaveProperty('metaData');
    expect(result).toHaveProperty('seriesData');
  });

  it('should throw an error when the API call fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    await expect(fetchTimeSeriesDaily(mockUrl, mockSymbol, mockApiKey))
      .rejects
      .toThrow('Failed to fetch time series data for IBM: Error: Network error');
  });
});

