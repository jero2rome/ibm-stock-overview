// chartUtils.ts
import * as d3 from 'd3';
import { TimeSeriesData } from '../types/timeSeriesTypes';

export const drawChart = (container: SVGSVGElement, timeSeriesData: TimeSeriesData[], dimensions: { width: number, height: number }, margins: { top: number, right: number, bottom: number, left: number }) => {
  const svg = d3.select(container);
  svg.selectAll("*").remove();

  const svgGroup = svg.append("g").attr("transform", `translate(${margins.left},${margins.top})`);

  const xScale = d3.scaleTime()
    .range([0, dimensions.width - margins.left - margins.right])
    .domain(d3.extent(timeSeriesData, d => d.date) as [Date, Date]);

  const yPriceScale = d3.scaleLinear()
    .range([dimensions.height - margins.top - margins.bottom, 0])
    .domain([0, d3.max(timeSeriesData, d => d.close) as number]);

  drawLine(svgGroup, timeSeriesData, xScale, yPriceScale);
  drawAxes(svgGroup, xScale, yPriceScale, dimensions, margins);
  drawVolumeBars(svgGroup, timeSeriesData, xScale, dimensions, margins);
};

const drawLine = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, timeSeriesData: TimeSeriesData[], xScale: d3.ScaleTime<number, number, never>, yPriceScale: d3.ScaleLinear<number, number, never>) => {
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

const drawAxes = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, xScale: d3.ScaleTime<number, number, never>, yPriceScale: d3.ScaleLinear<number, number, never>, dimensions: { width: number, height: number }, margins: { top: number, right: number, bottom: number, left: number }) => {
  const chartWidth = dimensions.width - margins.left - margins.right;
  const chartHeight = dimensions.height - margins.top - margins.bottom;

  svg.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .attr("transform", `translate(${chartWidth}, 0)`)
    .call(d3.axisRight(yPriceScale));
};

const drawVolumeBars = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, timeSeriesData: TimeSeriesData[], xScale: d3.ScaleTime<number, number, never>, dimensions: { width: number, height: number }, margins: { top: number, right: number, bottom: number, left: number }) => {
  const barWidth = 3;
  const volumeMaxHeight = 50; // Maximum height for volume bars
  const chartHeight = dimensions.height - margins.top - margins.bottom;
  const maxVolume = d3.max(timeSeriesData, d => d.volume / 1e6) ?? 0;

  svg.selectAll('.bar')
    .data(timeSeriesData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.date) - barWidth / 2)
    .attr('y', d => chartHeight - (volumeMaxHeight * (d.volume / 1e6) / maxVolume))
    .attr('height', d => volumeMaxHeight * (d.volume / 1e6) / maxVolume)
    .attr('width', barWidth)
    .attr('fill', (d, i) => d.close > timeSeriesData[i - 1]?.close ? 'green' : 'red');
};
