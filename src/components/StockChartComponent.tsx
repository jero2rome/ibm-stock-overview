import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { financialDataService } from '../services/financialDataService';
import { TimeSeriesData, TimeSeriesMetaData } from '../types/timeSeriesTypes';

const StockChartComponent: React.FC = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [metaData, setMetaData] = useState<TimeSeriesMetaData | null>(null);
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const url = process.env.REACT_APP_API_URL!;
    const symbol = process.env.REACT_APP_SYMBOL!;
    const apiKey = process.env.REACT_APP_API_KEY!;

    financialDataService.getChart(url, symbol, apiKey)
      .then(({ metaData, seriesData }) => {
        setMetaData(metaData);
        setTimeSeriesData(seriesData);
      })
      .catch(error => console.error('Error fetching chart data:', error));
  }, []);

  useEffect(() => {
    if (timeSeriesData.length && d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const x = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(timeSeriesData, (d: TimeSeriesData) => d.date) as [Date, Date]);

      const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(timeSeriesData, (d: TimeSeriesData) => d.close) as number]);

      const line = d3.line<TimeSeriesData>()
        .x((d: TimeSeriesData) => x(d.date))
        .y((d: TimeSeriesData) => y(d.close));

      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

      g.append("path")
        .datum(timeSeriesData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    }
  }, [timeSeriesData]);

  return (
    <div>
    {metaData && (
      <div>
        <h3>{metaData.symbol} - {metaData.information}</h3>
        <p>Last Refreshed: {metaData.lastRefreshed}</p>
        <p>Time Zone: {metaData.timeZone}</p>
      </div>
    )}
  <svg ref={d3Container} width={960} height={500} />
  </div>);
};

export default StockChartComponent;
