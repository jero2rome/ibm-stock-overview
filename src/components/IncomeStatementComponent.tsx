// IncomeStatementComponent.tsx
import React from 'react';
import GenericFinancialDataComponent from './GenericFinancialDataComponent';
import { financialDataService } from '../services/financialDataService';
import { FinancialDataWrapper } from '../types/FinancialData';

const IncomeStatementComponent: React.FC = () => {
  const url = process.env.REACT_APP_API_URL!;
  const symbol = process.env.REACT_APP_SYMBOL!;
  const apiKey = process.env.REACT_APP_API_KEY!;

  const fetchIncomeStatements = async (): Promise<FinancialDataWrapper> => {
    const data = await financialDataService.getIncomeStatement(url, symbol, apiKey);
    return ({
      annual: data.annualIncomeStatements,
      quarterly: data.quarterlyIncomeStatements
    });
  };

  return <GenericFinancialDataComponent fetchDataFunction={fetchIncomeStatements} header="Income Statement" />;
};

export default IncomeStatementComponent;
