// components/FinancialTable.js
import React from 'react';
import { FinancialData } from '../types/FinancialData'; // Update with the correct type
import './FinancialTable.scss';

const FinancialTable: React.FC<{ items: FinancialData[] }> = ({ items }) => {
  const keys = items[0] ? Object.keys(items[0]) : [];

  return (
    <table className="stockTable">
      <thead>
        <tr>
          <th>Breakdown</th>
          {items.map((item, index) => (
            <th key={index}>{new Date(item.fiscalDateEnding).getFullYear()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {keys.map(key => (
          <tr key={key}>
            <td>{key}</td>
            {items.map((item, index) => (
              <td key={index}>{(item as any)[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FinancialTable;
