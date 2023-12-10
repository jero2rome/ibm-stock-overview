import React, { useState, useEffect } from 'react';
import { fetchBalanceSheet } from '../services/balanceSheetService';
import { BalanceSheetData } from '../types/balanceSheetType';
import { SelectButton } from 'primereact/selectbutton';

const BalanceSheetComponent: React.FC = () => {
  const [balanceSheets, setBalanceSheets] = useState<{
    annual: BalanceSheetData[];
    quarterly: BalanceSheetData[];
  }>({
    annual: [],
    quarterly: []
  });

  const [selectedPeriod, setSelectedPeriod] = useState<'annual' | 'quarterly'>('annual');

  useEffect(() => {
    const symbol = process.env.REACT_APP_SYMBOL!;
    const apiKey = process.env.REACT_APP_API_KEY!;
    fetchBalanceSheet(symbol, apiKey)
      .then(data => {
        setBalanceSheets({
          annual: data.annualBalanceSheets,
          quarterly: data.quarterlyBalanceSheets
        });
      })
      .catch(error => console.error('Fetching income statements failed', error));
  }, []);

  const options = [
    { label: 'Annual', value: 'annual' },
    { label: 'Quarterly', value: 'quarterly' }
  ];

  const renderTable = (statements: BalanceSheetData[]) => {
    const keys = statements[0] ? Object.keys(statements[0]) : [];

    return (
      <table>
        <thead>
          <tr>
            <th>Breakdown</th>
            {statements.map((statement, index) => (
              <th key={index}>{new Date(statement.fiscalDateEnding).getFullYear()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map(key => (
            <tr key={key}>
              <td>{key}</td>
              {statements.map((statement, index) => (
                <td key={index}>{(statement as any)[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Income Statements</h2>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <SelectButton value={selectedPeriod} options={options} onChange={(e) => setSelectedPeriod(e.value)} />
      </div>
      {selectedPeriod === 'annual' ? (
        renderTable(balanceSheets.annual)
      ) : (
        renderTable(balanceSheets.quarterly)
      )}
    </div>
  );
};

export default BalanceSheetComponent;
