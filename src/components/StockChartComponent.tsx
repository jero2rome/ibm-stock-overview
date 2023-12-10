import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { financialDataService } from '../services/financialDataService';
import { TimeSeriesData, TimeSeriesMetaData } from '../types/timeSeriesTypes';
import './StockChartComponent.scss';

const StockChartComponent: React.FC = () => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [metaData, setMetaData] = useState<TimeSeriesMetaData | null>(null);
  const d3Container = useRef<SVGSVGElement | null>(null);

  const margins = useMemo(() => ({ top: 20, right: 20, bottom: 30, left: 50 }), []);
  const dimensions = useMemo(() => ({ width: 960, height: 500 }), []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (timeSeriesData.length && d3Container.current) {
      drawChart();
    }
  }, [timeSeriesData]);

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

  const drawChart = () => {

    const svg = initializeChart();
    const { xScale, yPriceScale } = createScales();

    const chartWidth = dimensions.width - margins.left - margins.right;
    const chartHeight = dimensions.height - margins.top - margins.bottom;

    drawLine(svg, xScale, yPriceScale);
    drawAxes(svg, xScale, yPriceScale, chartWidth, chartHeight);
    drawVolumeBars(svg, xScale, chartHeight);
  };

  const initializeChart = () => {
    const svg = d3.select(d3Container.current);
    svg.selectAll("*").remove();
    return svg.append("g").attr("transform", `translate(${margins.left},${margins.top})`);
  };

  const createScales = () => {
    const xScale = d3.scaleTime()
      .range([0, dimensions.width - margins.left - margins.right])
      .domain(d3.extent(timeSeriesData, d => d.date) as [Date, Date]);

    const yPriceScale  = d3.scaleLinear()
      .range([dimensions.height - margins.top - margins.bottom, 0])
      .domain([0, d3.max(timeSeriesData, d => d.close) as number]);

    return { xScale, yPriceScale  };
  };

  const drawLine = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, xScale: d3.ScaleTime<number, number, never>, yPriceScale: d3.ScaleLinear<number, number, never>) => {
    const lineGenerator = d3.line<TimeSeriesData>()
      .x(d => xScale(d.date))
      .y(d => yPriceScale(d.close))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(timeSeriesData)
      .attr("class", "line")
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);
  };

  const drawAxes = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, xScale: d3.ScaleTime<number, number, never>, yPriceScale: d3.ScaleLinear<number, number, never>, chartWidth: number, chartHeight: number) => {

      // X-axis
      svg.append("g")
  .attr("transform", `translate(0,${chartHeight})`)
  .call(d3.axisBottom(xScale));

      // Price Y-axis
      svg.append("g")
      .attr("transform", `translate(${chartWidth}, 0)`)
      .call(d3.axisRight(yPriceScale));
  };

  const drawVolumeBars = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, xScale: d3.ScaleTime<number, number, never>, chartHeight: number) => {

    // Volume bars
    const barWidth = 3;
    const volumeMaxHeight = 50; // Maximum height for volume bars

  // Calculate the maximum volume in millions for the y-axis scale
  // Provide a fallback of 0 for maxVolume in case timeSeriesData is empty
  const maxVolume = d3.max(timeSeriesData, d => d.volume / 1e6) ?? 0;

    svg.selectAll('.bar')
    .data(timeSeriesData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.date) - barWidth / 2)
    .attr('y', d => chartHeight - (volumeMaxHeight * (d.volume / 1e6) / maxVolume)) // Scale the height to the maxVolume
    .attr('height', d => volumeMaxHeight * (d.volume / 1e6) / maxVolume) // Scale the height to fit within volumeMaxHeight
    .attr('width', barWidth)
    .attr('fill', (d, i) => {
      if (i === 0) return 'grey'; // First bar, no comparison
      return d.close > timeSeriesData[i - 1].close ? 'green' : 'red';
    });
  };

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
