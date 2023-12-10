export interface FinancialData {
  fiscalDateEnding: string;
  reportedCurrency: string;
}

// types/financialTypes.ts
export type FinancialDataWrapper = {
  annual: FinancialData[];
  quarterly: FinancialData[];
};

