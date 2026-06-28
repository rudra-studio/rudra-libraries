import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// --- DATA STRUCTURES ---
export interface LineDataPoint {
  x: string; // e.g., "Jan", "Feb", "2023"
  y: number; // e.g., 100, 250
}

export interface LineSeries {
  id: string; // Unique identifier for the line (e.g., "Revenue")
  color?: string; // Optional specific color for this line
  data: LineDataPoint[];
}

export interface AnimatedLineChartProps {
  /** The dataset to render. Array of series for multi-line support. */
  series?: LineSeries[]; /* @binding */

  /** Line curve style */
  curveType?: 'linear' | 'smooth' | 'step'; /* @select|linear|smooth|step */

  /** Stroke width of the lines */
  strokeWidth?: number;

  /** Show dots on data points? */
  showDots?: boolean;

  /** Default palette if individual series colors are not provided */
  themeColors?: string[]; /* @complex|{"type":"array","items":{"type":"string"}} */

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  series = [
    { id: 'Product A', data: [{ x: 'Q1', y: 30 }, { x: 'Q2', y: 80 }, { x: 'Q3', y: 45 }, { x: 'Q4', y: 100 }] },
    { id: 'Product B', data: [{ x: 'Q1', y: 10 }, { x: 'Q2', y: 40 }, { x: 'Q3', y: 70 }, { x: 'Q4', y: 50 }] }
  ],
  curveType = 'smooth',
  strokeWidth = 3,
  showDots = true,
  themeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'], // Tailwind: blue, emerald, amber, red, violet
  marginTop = 20,
  marginBottom = 30,
  marginLeft = 40,
  marginRight = 20,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });

  // 1. Responsive Observer for the Builder Canvas
  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height || 300
        });
      }
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, []);

  // 2. The D3 Engine
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || series.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // Extract all unique X values across all series for the categorical X-axis
    const allXValues = Array.from(new Set(series.flatMap(s => s.data.map(d => d.x))));

    // Find the global maximum Y value to scale the chart properly
    const maxY = d3.max(series.flatMap(s => s.data.map(d => d.y))) || 100;

    // --- SCALES ---
    // scalePoint is perfect for line charts with categorical data (like months/quarters)
    const x = d3.scalePoint()
      .domain(allXValues)
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, maxY]).nice()
      .range([height - marginBottom, marginTop]);

    // Color Fallback Generator
    const colorScale = d3.scaleOrdinal<string>().range(themeColors);

    // --- LINE GENERATOR ---
    const lineGenerator = d3.line<LineDataPoint>()
      .x(d => x(d.x)!)
      .y(d => y(d.y));

    // Apply the user's chosen curve style
    if (curveType === 'smooth') lineGenerator.curve(d3.curveMonotoneX);
    else if (curveType === 'step') lineGenerator.curve(d3.curveStepAfter);
    else lineGenerator.curve(d3.curveLinear);

    // --- AXES ---
    // Create axis groups if they don't exist
    if (svg.select('.x-axis').empty()) {
      svg.append('g').attr('class', 'axis x-axis');
      svg.append('g').attr('class', 'axis y-axis');
    }

    // Update X Axis
    svg.select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .transition().duration(500)
      .call(d3.axisBottom(x))
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b');

    // Update Y Axis
    svg.select<SVGGElement>('.y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .transition().duration(500)
      .call(d3.axisLeft(y).ticks(5))
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b');

    // Clean up Y-axis visuals (remove vertical line, add subtle grid)
    svg.select('.y-axis').select('.domain').remove();
    svg.selectAll('.y-axis .tick line')
      .attr('x2', width - marginLeft - marginRight)
      .attr('stroke-opacity', 0.1);

    // --- DRAWING THE LINES (The D3 Data Join) ---
    // Create a container group for the lines so they stay organized
    let linesGroup = svg.select<SVGGElement>('.lines-group');
    if (linesGroup.empty()) {
      linesGroup = svg.append('g').attr('class', 'lines-group');
    }

    const paths = linesGroup.selectAll<SVGPathElement, LineSeries>('.line-path')
      .data(series, (d) => d.id);

    // 1. EXIT (Remove old lines)
    paths.exit()
      .transition().duration(400)
      .style('opacity', 0)
      .remove();

    // 2. ENTER (Add new lines with a draw-in animation)
    const enterPaths = paths.enter()
      .append('path')
      .attr('class', 'line-path')
      .attr('fill', 'none')
      .attr('stroke', (d, i) => d.color || colorScale(d.id))
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', d => lineGenerator(d.data));

    // The "Draw-in" animation trick using stroke-dasharray
    enterPaths.each(function () {
      const length = this.getTotalLength();
      d3.select(this)
        .attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(1500) // 1.5 second initial draw time
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
    });

    // 3. UPDATE (Morph existing lines when data changes)
    paths.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('d', d => lineGenerator(d.data))
      .attr('stroke', (d, i) => d.color || colorScale(d.id))
      .attr('stroke-width', strokeWidth);


    // --- DRAWING THE DOTS (Optional) ---
    let dotsGroup = svg.select<SVGGElement>('.dots-group');
    if (dotsGroup.empty()) {
      dotsGroup = svg.append('g').attr('class', 'dots-group');
    }

    if (showDots) {
      // Flatten the series data for the dots join, keeping a reference to the parent series color
      const flattenedData = series.flatMap(s =>
        s.data.map(d => ({ ...d, seriesId: s.id, color: s.color || colorScale(s.id) }))
      );

      const dots = dotsGroup.selectAll<SVGCircleElement, any>('.dot')
        .data(flattenedData, d => `${d.seriesId}-${d.x}`);

      dots.exit()
        .transition().duration(300)
        .attr('r', 0)
        .remove();

      dots.enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.x)!)
        .attr('cy', d => y(d.y))
        .attr('r', 0) // Start tiny
        .attr('fill', 'white')
        .attr('stroke', d => d.color)
        .attr('stroke-width', 2)
        .transition().duration(750).delay(500) // Pop in after the line starts drawing
        .attr('r', strokeWidth + 1);

      dots.transition()
        .duration(750)
        .attr('cx', d => x(d.x)!)
        .attr('cy', d => y(d.y))
        .attr('stroke', d => d.color)
        .attr('stroke-width', 2);
    } else {
      dotsGroup.selectAll('.dot').remove();
    }

  }, [series, dimensions, curveType, strokeWidth, showDots, themeColors, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[300px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedLineChart;