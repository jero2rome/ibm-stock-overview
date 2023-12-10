// components/GenericFinancialDataComponent.tsx
import React, { useState, useEffect } from 'react';
import { SelectButton } from 'primereact/selectbutton';
import FinancialTable from './FinancialTable';
import { FinancialDataWrapper } from '../types/FinancialData';

type GenericFinancialDataComponentProps = {
  fetchDataFunction: () => Promise<FinancialDataWrapper>;
  header: string;
};

const GenericFinancialDataComponent: React.FC<GenericFinancialDataComponentProps> = ({ fetchDataFunction, header }) => {
  const [financialData, setFinancialData] = useState<FinancialDataWrapper>({ annual: [], quarterly: [] });
  const [selectedPeriod, setSelectedPeriod] = useState<'annual' | 'quarterly'>('annual');

  useEffect(() => {
    fetchDataFunction()
      .then(data => setFinancialData(data))
      .catch(error => console.error(`Fetching ${header.toLowerCase()} failed`, error));
  }, [fetchDataFunction, header]);

  const options = [
    { label: 'Annual', value: 'annual' },
    { label: 'Quarterly', value: 'quarterly' }
  ];

  return (
    <div>
      <h2 className='headerTag'>{header}</h2>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <SelectButton value={selectedPeriod} options={options} onChange={(e) => setSelectedPeriod(e.value)} />
      </div>
      <FinancialTable items={selectedPeriod === 'annual' ? financialData.annual : financialData.quarterly} />
    </div>
  );
};

export default GenericFinancialDataComponent;
