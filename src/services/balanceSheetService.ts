// src/services/balanceSheetService.ts

import axios from 'axios';
import {
  buildQueryParams
} from '../utils/serviceHelpers';
import {
  RawBalanceSheetEntry,
  BalanceSheetData
} from '../types/balanceSheetType';

export const fetchBalanceSheet = async (
  url: string,
  symbol: string,
  apiKey: string
): Promise < {
  annualBalanceSheets: BalanceSheetData[];
  quarterlyBalanceSheets: BalanceSheetData[];
} > => {
  try {
    const response = await axios.get(url, {
      params: buildQueryParams('BALANCE_SHEET', symbol, apiKey),
    });

    const annualBalanceSheets = parseBalanceSheetData(response.data['annualReports']);
    const quarterlyBalanceSheets = parseBalanceSheetData(response.data['quarterlyReports']);

    return {
      annualBalanceSheets,
      quarterlyBalanceSheets
    };
  } catch (error) {
    console.error('Error fetching balance sheet data:', error);
    throw error;
  }
};

const parseBalanceSheetData = (reports: RawBalanceSheetEntry[]): BalanceSheetData[] => {
  return reports.map(report => ({
    fiscalDateEnding: report.fiscalDateEnding,
    reportedCurrency: report.reportedCurrency,
    totalAssets: report.totalAssets,
    totalCurrentAssets: report.totalCurrentAssets,
    cashAndCashEquivalentsAtCarryingValue: report.cashAndCashEquivalentsAtCarryingValue,
    cashAndShortTermInvestments: report.cashAndShortTermInvestments,
    inventory: report.inventory,
    currentNetReceivables: report.currentNetReceivables,
    totalNonCurrentAssets: report.totalNonCurrentAssets,
    propertyPlantEquipment: report.propertyPlantEquipment,
    accumulatedDepreciationAmortizationPPE: report.accumulatedDepreciationAmortizationPPE,
    intangibleAssets: report.intangibleAssets,
    intangibleAssetsExcludingGoodwill: report.intangibleAssetsExcludingGoodwill,
    goodwill: report.goodwill,
    investments: report.investments,
    longTermInvestments: report.longTermInvestments,
    shortTermInvestments: report.shortTermInvestments,
    otherCurrentAssets: report.otherCurrentAssets,
    otherNonCurrentAssets: report.otherNonCurrentAssets,
    totalLiabilities: report.totalLiabilities,
    totalCurrentLiabilities: report.totalCurrentLiabilities,
    currentAccountsPayable: report.currentAccountsPayable,
    deferredRevenue: report.deferredRevenue,
    currentDebt: report.currentDebt,
    shortTermDebt: report.shortTermDebt,
    totalNonCurrentLiabilities: report.totalNonCurrentLiabilities,
    capitalLeaseObligations: report.capitalLeaseObligations,
    longTermDebt: report.longTermDebt,
    currentLongTermDebt: report.currentLongTermDebt,
    longTermDebtNoncurrent: report.longTermDebtNoncurrent,
    shortLongTermDebtTotal: report.shortLongTermDebtTotal,
    otherCurrentLiabilities: report.otherCurrentLiabilities,
    otherNonCurrentLiabilities: report.otherNonCurrentLiabilities,
    totalShareholderEquity: report.totalShareholderEquity,
    treasuryStock: report.treasuryStock,
    retainedEarnings: report.retainedEarnings,
    commonStock: report.commonStock,
    commonStockSharesOutstanding: report.commonStockSharesOutstanding
  }));
};
