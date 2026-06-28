import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface HundredPercentDataPoint {
  id: string | number;
  category: string; // e.g., "Q1", "Q2"
  [key: string]: any; // Dynamic keys (e.g., productA: 120, productB: 80)
}

export interface AnimatedHundredPercentBarChartProps {
  /** The dataset containing the categories and their sub-components. */
  data?: HundredPercentDataPoint[]; /* @array */ /* @binding */

  /** The exact keys in the data objects that should be stacked on top of each other. */
  stackKeys?: string[]; /* @array */

  /** Default palette for the stacked layers */
  themeColors?: string[]; /* @complex|{"type":"array","items":{"type":"string"}} */

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number; // Might need extra room for the % labels
  marginRight?: number;

  className?: string;
}

export const AnimatedHundredPercentBarChart: React.FC<AnimatedHundredPercentBarChartProps> = ({
  data = [
    { id: '1', category: 'Q1', mobile: 120, desktop: 80, tablet: 40 },
    { id: '2', category: 'Q2', mobile: 150, desktop: 90, tablet: 30 },
    { id: '3', category: 'Q3', mobile: 180, desktop: 110, tablet: 50 },
    { id: '4', category: 'Q4', mobile: 240, desktop: 140, tablet: 60 },
  ],
  stackKeys = ['mobile', 'desktop', 'tablet'],
  themeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  marginTop = 20,
  marginBottom = 40,
  marginLeft = 50,
  marginRight = 20,
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

  // 2. D3 Engine
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || data.length === 0 || stackKeys.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // --- DATA PREPARATION (The 100% Stack) ---
    // d3.stackOffsetExpand normalizes the values so the total of each stack is 1 (100%)
    const stackGenerator = d3.stack<HundredPercentDataPoint>()
      .keys(stackKeys)
      .offset(d3.stackOffsetExpand);

    const stackedSeries = stackGenerator(data);

    // --- SCALES ---
    const categories = data.map(d => d.category);

    const x = d3.scaleBand()
      .domain(categories)
      .range([marginLeft, width - marginRight])
      .padding(0.3);

    // Because of stackOffsetExpand, the Y domain is strictly 0 to 1
    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height - marginBottom, marginTop]);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(stackKeys)
      .range(themeColors);

    // --- AXES & GRID ---
    if (svg.select('.x-axis').empty()) {
      svg.append('g').attr('class', 'axis x-axis');
      svg.append('g').attr('class', 'axis y-axis');
    }

    // X Axis
    svg.select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .transition().duration(500)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove());

    // Y Axis (Formatted as Percentages)
    svg.select<SVGGElement>('.y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .transition().duration(500)
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d3.format(".0%")) // Turns 0.5 into 50%
        .tickSize(-(width - marginLeft - marginRight))
      )
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke-opacity', 0.1).attr('stroke-dasharray', '4,4'));

    // --- DRAWING THE STACKS ---
    let stacksGroup = svg.select<SVGGElement>('.stacks-group');
    if (stacksGroup.empty()) {
      stacksGroup = svg.append('g').attr('class', 'stacks-group');
    }

    // Bind the Layers
    const layers = stacksGroup.selectAll<SVGGElement, d3.Series<HundredPercentDataPoint, string>>('.layer')
      .data(stackedSeries, d => d.key);

    layers.exit().remove();

    const enterLayers = layers.enter()
      .append('g')
      .attr('class', 'layer')
      .attr('fill', d => colorScale(d.key));

    const mergedLayers = enterLayers.merge(layers)
      .transition().duration(500)
      .attr('fill', d => colorScale(d.key))
      .selection();

    // Bind the Rectangles inside each layer
    const rects = mergedLayers.selectAll<SVGRectElement, d3.SeriesPoint<HundredPercentDataPoint>>('rect')
      .data(d => d, d => d.data.id as string);

    // EXIT
    rects.exit()
      .transition().duration(300)
      .attr('y', y(0))
      .attr('height', 0)
      .remove();

    // ENTER
    const enterRects = rects.enter()
      .append('rect')
      .attr('x', d => x(d.data.category) || 0)
      .attr('width', x.bandwidth())
      .attr('y', y(0)) // Start at the global baseline
      .attr('height', 0)
      .style('cursor', 'pointer');

    // ANIMATE ENTER
    enterRects.transition()
      .duration(700)
      .delay((_, i) => i * 50)
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d[1])) // Move to normalized % height
      .attr('height', d => y(d[0]) - y(d[1]));

    // ANIMATE UPDATE 
    rects.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('x', d => x(d.data.category) || 0)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]));

    // HOVER INTERACTIONS
    enterRects.merge(rects)
      .on('mouseenter', function () {
        stacksGroup.selectAll('rect')
          .transition().duration(200)
          .attr('opacity', 0.4);

        d3.select(this)
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
      })
      .on('mouseleave', function () {
        stacksGroup.selectAll('rect')
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('stroke', 'none');
      });

  }, [data, stackKeys, dimensions, themeColors, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[350px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedHundredPercentBarChart;