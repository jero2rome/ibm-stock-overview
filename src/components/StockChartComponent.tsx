import React, { useState, useEffect, useRef, useMemo  } from 'react';
import { financialDataService } from '../services/financialDataService';
import { TimeSeriesData, TimeSeriesMetaData } from '../types/timeSeriesTypes';
import { drawChart } from '../utils/chartUtils';
import './StockChartComponent.scss';

const StockChartComponent: React.FC = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [metaData, setMetaData] = useState<TimeSeriesMetaData | null>(null);
  const d3Container = useRef<SVGSVGElement | null>(null);

  const margins = useMemo(() => ({ top: 20, right: 20, bottom: 30, left: 50 }), []);
  const dimensions = useMemo(() => ({ width: 960, height: 500 }), []);

  const fetchData = async () => {
    const url = process.env.REACT_APP_API_URL!;
    const symbol = process.env.REACT_APP_SYMBOL!;
    const apiKey = process.env.REACT_APP_API_KEY!;
    try {
      const { metaData, seriesData } = await financialDataService.getChart(url, symbol, apiKey);
      setMetaData(metaData);
      setTimeSeriesData(seriesData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (timeSeriesData.length && d3Container.current) {
      drawChart(d3Container.current, timeSeriesData, dimensions, margins);
    }
  }, [timeSeriesData, dimensions, margins]);

  return (
    <div className='stockDiv'>
      {metaData && (
        <div className='headerTagsDiv'>
          <h3>{metaData.symbol} - {metaData.information}</h3>
          <span className='pTagHeader'>
          <p className='left-aligned'>Last Refreshed: {metaData.lastRefreshed}</p> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <p className='right-aligned'>Time Zone: {metaData.timeZone}</p>
          </span>
        </div>
      )}
      <svg ref={d3Container} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default StockChartComponent;
