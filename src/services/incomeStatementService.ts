// src/services/incomeStatementService.ts

import axios from 'axios';
import { RawIncomeStatementEntry, IncomeStatementData } from '../types/incomeStatementTypes';

export const fetchIncomeStatement = async (symbol: string, apiKey: string): Promise<IncomeStatementData[]> => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'INCOME_STATEMENT',
        symbol: symbol,
        apikey: apiKey
      }
    });

    if (response.data['annualReports']) {
      const incomeStatements: IncomeStatementData[] = response.data['annualReports'].map((report: RawIncomeStatementEntry) => {
        return {
          fiscalDateEnding: new Date(report.fiscalDateEnding),
          reportedCurrency: report.reportedCurrency,
          grossProfit: Number(report.grossProfit),
            totalRevenue: Number(report.totalRevenue),
            costOfRevenue: Number(report.costOfRevenue),
            costofGoodsAndServicesSold: Number(report.costofGoodsAndServicesSold),
            operatingIncome: Number(report.operatingIncome),
            sellingGeneralAndAdministrative: Number(report.sellingGeneralAndAdministrative),
            researchAndDevelopment: Number(report.researchAndDevelopment),
            operatingExpenses: Number(report.operatingExpenses),
            investmentIncomeNet: report.investmentIncomeNet === 'None' ? 0 : Number(report.investmentIncomeNet),
            netInterestIncome: Number(report.netInterestIncome),
            interestIncome: Number(report.interestIncome),
            interestExpense: Number(report.interestExpense),
            nonInterestIncome: Number(report.nonInterestIncome),
            otherNonOperatingIncome: Number(report.otherNonOperatingIncome),
            depreciation: Number(report.depreciation),
            depreciationAndAmortization: Number(report.depreciationAndAmortization),
            incomeBeforeTax: Number(report.incomeBeforeTax),
            incomeTaxExpense: Number(report.incomeTaxExpense),
            interestAndDebtExpense: Number(report.interestAndDebtExpense),
            netIncomeFromContinuingOperations: Number(report.netIncomeFromContinuingOperations),
            comprehensiveIncomeNetOfTax: Number(report.comprehensiveIncomeNetOfTax),
            ebit: Number(report.ebit),
            ebitda: Number(report.ebitda),
            netIncome: Number(report.netIncome)            
        };
      });
      return incomeStatements;
    }
    throw new Error('Income statement data is not available');
  } catch (error) {
    console.error('Error fetching income statement data:', error);
    throw error;
  }
};
