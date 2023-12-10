import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { financialDataService } from '../services/financialDataService';
import { TimeSeriesData, TimeSeriesMetaData } from '../types/timeSeriesTypes';

const StockChartComponent: React.FC = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [metaData, setMetaData] = useState<TimeSeriesMetaData | null>(null);
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
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
        // Handle error appropriately
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (timeSeriesData.length && d3Container.current) {
      drawChart();
    }
  }, [timeSeriesData]);

  const margins = useMemo(() => ({ top: 20, right: 20, bottom: 30, left: 50 }), []);
  const dimensions = useMemo(() => ({ width: 960, height: 500 }), []);

  const drawChart = () => {
    const svg = d3.select(d3Container.current);
    svg.selectAll("*").remove();

    const { xScale, yScale } = createScales();
    const g = svg.append("g").attr("transform", `translate(${margins.left},${margins.top})`);

    g.append("g")
      .attr("transform", `translate(0,${dimensions.height - margins.bottom - margins.top})`)
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Price ($)");

    const line = d3.line<TimeSeriesData>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.close));

    g.append("path")
      .datum(timeSeriesData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  };

  const createScales = () => {
    const xScale = d3.scaleTime()
      .range([0, dimensions.width - margins.left - margins.right])
      .domain(d3.extent(timeSeriesData, d => d.date) as [Date, Date]);

    const yScale = d3.scaleLinear()
      .range([dimensions.height - margins.top - margins.bottom, 0])
      .domain([0, d3.max(timeSeriesData, d => d.close) as number]);

    return { xScale, yScale };
  };

  return (
    <div>
      {metaData && (
        <div>
          <h3>{metaData.symbol} - {metaData.information}</h3>
          <p>Last Refreshed: {metaData.lastRefreshed}</p>
          <p>Time Zone: {metaData.timeZone}</p>
        </div>
      )}
      <svg ref={d3Container} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default StockChartComponent;
