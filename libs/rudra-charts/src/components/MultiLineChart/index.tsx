import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface MultiLineDataPoint {
  date: string | Date; // e.g., "2023-01-01"
  value: number;
  category: string; // e.g., "Product A", "Product B"
}

export interface AnimatedMultiLineChartProps {
  /** The dataset */
  data?: MultiLineDataPoint[];
  /** Default palette for the categories */
  themeColors?: string[];
  /** Stroke width of the lines */
  strokeWidth?: number;
  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  className?: string;
}

export const AnimatedMultiLineChart: React.FC<AnimatedMultiLineChartProps> = ({
  data = [
    { date: '2023-01-01', value: 40, category: 'Product A' },
    { date: '2023-02-01', value: 55, category: 'Product A' },
    { date: '2023-03-01', value: 45, category: 'Product A' },
    { date: '2023-04-01', value: 70, category: 'Product A' },
    { date: '2023-01-01', value: 60, category: 'Product B' },
    { date: '2023-02-01', value: 65, category: 'Product B' },
    { date: '2023-03-01', value: 85, category: 'Product B' },
    { date: '2023-04-01', value: 100, category: 'Product B' },
    { date: '2023-01-01', value: 20, category: 'Product C' },
    { date: '2023-02-01', value: 35, category: 'Product C' },
    { date: '2023-03-01', value: 25, category: 'Product C' },
    { date: '2023-04-01', value: 50, category: 'Product C' },
  ],
  themeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  strokeWidth = 3,
  marginTop = 20,
  marginBottom = 40,
  marginLeft = 50,
  marginRight = 30,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 350 });

  // 1. Responsive Canvas Observer
  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height || 350
        });
      }
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, []);

  // 2. The D3 Engine
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || data.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // Ensure dates are parsed properly
    const parsedData = data.map(d => ({
      ...d,
      parsedDate: d.date instanceof Date ? d.date : new Date(d.date)
    }));

    // Group data by category so we can draw one line per category
    const groupedData = d3.group(parsedData, d => d.category);
    const categories = Array.from(groupedData.keys());

    // --- SCALES ---
    const x = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.parsedDate) as [Date, Date])
      .range([marginLeft, width - marginRight]);

    const yMax = d3.max(parsedData, d => d.value) || 100;
    const y = d3.scaleLinear()
      .domain([0, yMax * 1.1]).nice() // 10% buffer
      .range([height - marginBottom, marginTop]);

    const colorScale = d3.scaleOrdinal<string>().domain(categories).range(themeColors);

    // --- AXES & GRID LINES ---
    if (svg.select('.x-axis').empty()) {
      svg.append('g').attr('class', 'axis x-axis');
      svg.append('g').attr('class', 'axis y-axis');
    }

    svg.select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .transition().duration(500)
      .call(d3.axisBottom(x)
        .ticks(Math.max(width / 80, 2))
        .tickSize(-(height - marginTop - marginBottom))
      )
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke-opacity', 0.1));

    svg.select<SVGGElement>('.y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .transition().duration(500)
      .call(d3.axisLeft(y)
        .ticks(6)
        .tickSize(-(width - marginLeft - marginRight))
      )
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke-opacity', 0.1));

    // --- DRAWING THE LINES ---
    const lineGenerator = d3.line<any>()
      .x(d => x(d.parsedDate))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX); // Smooths the line

    let linesGroup = svg.select<SVGGElement>('.lines-group');
    if (linesGroup.empty()) {
      linesGroup = svg.append('g').attr('class', 'lines-group');
    }

    // Bind grouped data
    const paths = linesGroup.selectAll<SVGPathElement, [string, any[]]>('.line-path')
      .data(groupedData, d => d[0]);

    // EXIT: Remove old lines
    paths.exit()
      .transition().duration(400)
      .style('opacity', 0)
      .remove();

    // ENTER: Add new lines
    const enterPaths = paths.enter()
      .append('path')
      .attr('class', 'line-path')
      .attr('fill', 'none')
      .attr('stroke', d => colorScale(d[0]))
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .style('cursor', 'pointer');

    // INITIAL DRAW ANIMATION (Using stroke-dasharray trick)
    enterPaths
      .attr('d', d => lineGenerator(d[1]))
      .each(function () {
        const length = this.getTotalLength();
        d3.select(this)
          .attr('stroke-dasharray', `${length} ${length}`)
          .attr('stroke-dashoffset', length)
          .transition()
          .duration(1500)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);
      });

    // UPDATE: Animate existing lines to new positions
    paths.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('d', d => lineGenerator(d[1]))
      .attr('stroke', d => colorScale(d[0]))
      // Clear dasharray just in case it interferes with resize updates
      .attr('stroke-dasharray', null)
      .attr('stroke-dashoffset', null);

    // HOVER INTERACTIONS
    // Bring the hovered line to the front, thicken it, and dim the others
    enterPaths.merge(paths)
      .on('mouseenter', function () {
        linesGroup.selectAll('.line-path')
          .transition().duration(200)
          .style('opacity', 0.2);

        d3.select(this)
          .raise() // Bring to front
          .transition().duration(200)
          .style('opacity', 1)
          .attr('stroke-width', strokeWidth + 2);
      })
      .on('mouseleave', function () {
        linesGroup.selectAll('.line-path')
          .transition().duration(200)
          .style('opacity', 1)
          .attr('stroke-width', strokeWidth);
      });

  }, [data, dimensions, strokeWidth, themeColors, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[350px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedMultiLineChart;