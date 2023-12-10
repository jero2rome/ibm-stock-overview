// src/services/incomeStatementService.ts

import axios from 'axios';
import { RawIncomeStatementEntry, IncomeStatementData } from '../types/incomeStatementTypes';

export const fetchIncomeStatement = async (
  symbol: string,
  apiKey: string
): Promise<{
  annualIncomeStatements: IncomeStatementData[];
  quarterlyIncomeStatements: IncomeStatementData[];
}> => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'INCOME_STATEMENT',
        symbol: symbol,
        apikey: apiKey
      }
    });

    const parseIncomeStatementData = (reports: RawIncomeStatementEntry[]): IncomeStatementData[] => {
      return reports.map(report => ({
        fiscalDateEnding: report.fiscalDateEnding,
        reportedCurrency: report.reportedCurrency,
        grossProfit: report.grossProfit,
        totalRevenue: report.totalRevenue,
        costOfRevenue: report.costOfRevenue,
        costofGoodsAndServicesSold: report.costofGoodsAndServicesSold,
        operatingIncome: report.operatingIncome,
        sellingGeneralAndAdministrative: report.sellingGeneralAndAdministrative,
        researchAndDevelopment: report.researchAndDevelopment,
        operatingExpenses: report.operatingExpenses,
        investmentIncomeNet: report.investmentIncomeNet,
        netInterestIncome: report.netInterestIncome,
        interestIncome: report.interestIncome,
        interestExpense: report.interestExpense,
        nonInterestIncome: report.nonInterestIncome,
        otherNonOperatingIncome: report.otherNonOperatingIncome,
        depreciation: report.depreciation,
        depreciationAndAmortization: report.depreciationAndAmortization,
        incomeBeforeTax: report.incomeBeforeTax,
        incomeTaxExpense: report.incomeTaxExpense,
        interestAndDebtExpense: report.interestAndDebtExpense,
        netIncomeFromContinuingOperations: report.netIncomeFromContinuingOperations,
        comprehensiveIncomeNetOfTax: report.comprehensiveIncomeNetOfTax,
        ebit: report.ebit,
        ebitda: report.ebitda,
        netIncome: report.netIncome        
      }));
    };

    const annualIncomeStatements = parseIncomeStatementData(response.data['annualReports']);
    const quarterlyIncomeStatements = parseIncomeStatementData(response.data['quarterlyReports']);

    return { annualIncomeStatements, quarterlyIncomeStatements };
  } catch (error) {
    console.error('Error fetching income statement data:', error);
    throw error;
  }
};
