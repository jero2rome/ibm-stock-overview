// Import individual services
import { fetchTimeSeriesDaily } from './timeSeriesService';
import { fetchIncomeStatement } from './incomeStatementService';
import { fetchBalanceSheet } from './balanceSheetService';

// Unified Financial Data Service
class FinancialDataService {
  getChart(url:string, symbol: string, apiKey: string) {
    return fetchTimeSeriesDaily(url, symbol, apiKey);
  }

  getIncomeStatement(url:string, symbol: string, apiKey: string) {
    return fetchIncomeStatement(url, symbol, apiKey);
  }

  getBalanceSheet(url:string, symbol: string, apiKey: string) {
    return fetchBalanceSheet(url, symbol, apiKey);
  }
}

// Export an instance of the service
export const financialDataService = new FinancialDataService();
