// BalanceSheetComponent.tsx
import React from 'react';
import GenericFinancialDataComponent from './GenericFinancialDataComponent';
import { financialDataService } from '../services/financialDataService';
import { FinancialDataWrapper } from '../types/FinancialData';

const BalanceSheetComponent: React.FC = () => {
  const url = process.env.REACT_APP_API_URL!;
  const symbol = process.env.REACT_APP_SYMBOL!;
  const apiKey = process.env.REACT_APP_API_KEY!;

  const fetchBalanceSheet = async (): Promise<FinancialDataWrapper> => {
    const data = await financialDataService.getBalanceSheet(url, symbol, apiKey);
    return ({
      annual: data.annualBalanceSheets,
      quarterly: data.quarterlyBalanceSheets
    });
  };

  return <GenericFinancialDataComponent fetchDataFunction={fetchBalanceSheet} header="Balance Sheet" />;
};

export default BalanceSheetComponent;
