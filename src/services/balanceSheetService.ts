// src/services/balanceSheetService.ts

import axios from 'axios';
import { RawBalanceSheetEntry, BalanceSheetData } from '../types/balanceSheetType';

export const fetchBalanceSheet = async (symbol: string, apiKey: string): Promise<BalanceSheetData[]> => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'BALANCE_SHEET',
        symbol: symbol,
        apikey: apiKey
      }
    });

    if (response.data['annualReports']) {
      const balanceSheets: BalanceSheetData[] = response.data['annualReports'].map((report: RawBalanceSheetEntry) => {
        return {
          fiscalDateEnding: new Date(report.fiscalDateEnding),
          reportedCurrency: report.reportedCurrency,
          totalAssets: Number(report.totalAssets),
          totalCurrentAssets: Number(report.totalCurrentAssets),
          cashAndCashEquivalentsAtCarryingValue: Number(report.cashAndCashEquivalentsAtCarryingValue),
          cashAndShortTermInvestments: Number(report.cashAndShortTermInvestments),
          inventory: Number(report.inventory),
          currentNetReceivables: Number(report.currentNetReceivables),
          totalNonCurrentAssets: Number(report.totalNonCurrentAssets),
          propertyPlantEquipment: Number(report.propertyPlantEquipment),
          accumulatedDepreciationAmortizationPPE: Number(report.accumulatedDepreciationAmortizationPPE),
          intangibleAssets: Number(report.intangibleAssets),
          intangibleAssetsExcludingGoodwill: Number(report.intangibleAssetsExcludingGoodwill),
          goodwill: Number(report.goodwill),
          investments: report.investments === 'None' ? 0 : Number(report.investments),
          longTermInvestments: Number(report.longTermInvestments),
          shortTermInvestments: Number(report.shortTermInvestments),
          otherCurrentAssets: Number(report.otherCurrentAssets),
          otherNonCurrentAssets: report.otherNonCurrentAssets === 'None' ? 0 : Number(report.otherNonCurrentAssets),
          totalLiabilities: Number(report.totalLiabilities),
          totalCurrentLiabilities: Number(report.totalCurrentLiabilities),
          currentAccountsPayable: Number(report.currentAccountsPayable),
          deferredRevenue: Number(report.deferredRevenue),
          currentDebt: Number(report.currentDebt),
          shortTermDebt: Number(report.shortTermDebt),
          totalNonCurrentLiabilities: Number(report.totalNonCurrentLiabilities),
          capitalLeaseObligations: Number(report.capitalLeaseObligations),
          longTermDebt: Number(report.longTermDebt),
          currentLongTermDebt: Number(report.currentLongTermDebt),
          longTermDebtNoncurrent: Number(report.longTermDebtNoncurrent),
          shortLongTermDebtTotal: Number(report.shortLongTermDebtTotal),
          otherCurrentLiabilities: Number(report.otherCurrentLiabilities),
          otherNonCurrentLiabilities: Number(report.otherNonCurrentLiabilities),
          totalShareholderEquity: Number(report.totalShareholderEquity),
          treasuryStock: Number(report.treasuryStock),
          retainedEarnings: Number(report.retainedEarnings),
          commonStock: Number(report.commonStock),
          commonStockSharesOutstanding: report.commonStockSharesOutstanding
        };
      });
      return balanceSheets;
    }
    throw new Error('Balance sheet data is not available');
  } catch (error) {
    console.error('Error fetching balance sheet data:', error);
    throw error;
  }
};
