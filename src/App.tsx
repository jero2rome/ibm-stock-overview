import React, { useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import 'primereact/resources/themes/lara-light-cyan/theme.css'; // Choose the theme
import 'primeicons/primeicons.css'; // Icons
import StockChartComponent from './components/StockChartComponent';
import IncomeStatementComponent from './components/IncomeStatementComponent';
import BalanceSheetComponent from './components/BalanceSheetComponent';
import './App.scss';

const App: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    {label: 'Stock Chart', icon: 'pi pi-table'},
    {label: 'Income Statement', icon: 'pi pi-book'},
    {label: 'Balance Sheet', icon: 'pi pi-table'}
  ];

  return (
    <div>
      <TabMenu className='headerTab' model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
      <div className='stockDiv'>
        {/* Content based on the active tab */}
        {activeIndex === 0 && <StockChartComponent />}
        {activeIndex === 1 && <IncomeStatementComponent />}
        {activeIndex === 2 && <BalanceSheetComponent />}
      </div>
    </div>
  );
};

export default App;
