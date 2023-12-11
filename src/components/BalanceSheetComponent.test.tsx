import { render, screen, waitFor  } from '@testing-library/react';
import BalanceSheetComponent from './BalanceSheetComponent';
import { financialDataService } from '../services/financialDataService';

jest.mock('../services/financialDataService', () => ({
  financialDataService: {
    getBalanceSheet: jest.fn(),
  },
}));

const mockAnnualReports = [
  {
    fiscalDateEnding: "2022-12-31",
    reportedCurrency: "USD",
    totalAssets: "127243000000",
  },
  {
    fiscalDateEnding: "2021-12-31",
    reportedCurrency: "USD",
    totalAssets: "132001000000",
  },
];

const mockData = {
  annualBalanceSheets: mockAnnualReports,
  quarterlyBalanceSheets: [],
};

describe('BalanceSheetComponent', () => {

  it('fetches balance sheet data and renders it', async () => {

    (financialDataService.getBalanceSheet as jest.Mock).mockResolvedValue(mockData);

    render(<BalanceSheetComponent />);

     await waitFor(() => {
      expect(screen.getByText("Balance Sheet")).toBeInTheDocument();
    });

    expect(financialDataService.getBalanceSheet).toHaveBeenCalledWith(
      process.env.REACT_APP_API_URL,
      process.env.REACT_APP_SYMBOL,
      process.env.REACT_APP_API_KEY,
    );
  });
});
