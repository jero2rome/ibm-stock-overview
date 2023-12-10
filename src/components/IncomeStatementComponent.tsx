import React, { useState, useEffect } from 'react';
import { fetchIncomeStatement } from '../services/incomeStatementService'; 
import { IncomeStatementData } from '../types/incomeStatementTypes';
import { SelectButton } from 'primereact/selectbutton';

const IncomeStatementComponent: React.FC = () => {
  const [incomeStatements, setIncomeStatements] = useState<{
    annual: IncomeStatementData[];
    quarterly: IncomeStatementData[];
  }>({
    annual: [],
    quarterly: []
  });

  const [selectedPeriod, setSelectedPeriod] = useState<'annual' | 'quarterly'>('annual');

  useEffect(() => {
    const symbol = 'IBM';
    const apiKey = 'YOUR_API_KEY';
    fetchIncomeStatement(symbol, apiKey)
      .then(data => {
        setIncomeStatements({
          annual: data.annualIncomeStatements,
          quarterly: data.quarterlyIncomeStatements
        });
      })
      .catch(error => console.error('Fetching income statements failed', error));
  }, []);

  const options = [
    { label: 'Annual', value: 'annual' },
    { label: 'Quarterly', value: 'quarterly' }
  ];

  const renderTable = (statements: IncomeStatementData[]) => {
    const keys = statements[0] ? Object.keys(statements[0]) : [];

    return (
      <table>
        <thead>
          <tr>
            <th>Property</th>
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
        renderTable(incomeStatements.annual)
      ) : (
        renderTable(incomeStatements.quarterly)
      )}      
    </div>
  );
};

export default IncomeStatementComponent;
