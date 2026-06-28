import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface StackedBarDataPoint {
  id: string | number;
  category: string; // e.g., "Q1", "Q2"
  // Dynamic keys for the stacked layers (e.g., productA: 120, productB: 80)
  [key: string]: any;
}

export interface AnimatedStackedBarChartProps {
  /** The dataset containing the categories and their sub-components. */
  data?: StackedBarDataPoint[]; /* @array */ /* @binding */

  /** The exact keys in the data objects that should be stacked on top of each other. */
  stackKeys?: string[]; /* @array */

  /** Default palette for the stacked layers */
  themeColors?: string[]; /* @complex|{"type":"array","items":{"type":"string"}} */

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedStackedBarChart: React.FC<AnimatedStackedBarChartProps> = ({
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

    // --- DATA PREPARATION (The Stack) ---
    // d3.stack takes our flat data and generates layered arrays [y0, y1] for each stack key
    const stackGenerator = d3.stack<StackedBarDataPoint>().keys(stackKeys);
    const stackedSeries = stackGenerator(data);

    // --- SCALES ---
    const categories = data.map(d => d.category);

    // Find the absolute maximum total height to set the Y domain
    const yMax = d3.max(stackedSeries, layer => d3.max(layer, d => d[1])) || 100;

    const x = d3.scaleBand()
      .domain(categories)
      .range([marginLeft, width - marginRight])
      .padding(0.3); // Space between columns

    const y = d3.scaleLinear()
      .domain([0, yMax * 1.1]).nice() // 10% breathing room at the top
      .range([height - marginBottom, marginTop]);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(stackKeys)
      .range(themeColors);

    // --- AXES & GRID ---
    if (svg.select('.x-axis').empty()) {
      svg.append('g').attr('class', 'axis x-axis');
      svg.append('g').attr('class', 'axis y-axis');
    }

    svg.select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .transition().duration(500)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove());

    svg.select<SVGGElement>('.y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .transition().duration(500)
      .call(d3.axisLeft(y).ticks(6).tickSize(-(width - marginLeft - marginRight)))
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

    // 1. Bind the Layers (The keys like 'mobile', 'desktop')
    const layers = stacksGroup.selectAll<SVGGElement, d3.Series<StackedBarDataPoint, string>>('.layer')
      .data(stackedSeries, d => d.key);

    layers.exit().remove();

    const enterLayers = layers.enter()
      .append('g')
      .attr('class', 'layer')
      .attr('fill', d => colorScale(d.key));

    const mergedLayers = enterLayers.merge(layers)
      // Ensure fill updates if themeColors changes
      .transition().duration(500)
      .attr('fill', d => colorScale(d.key))
      .selection();

    // 2. Bind the Rectangles inside each layer (The actual blocks for Q1, Q2, etc.)
    const rects = mergedLayers.selectAll<SVGRectElement, d3.SeriesPoint<StackedBarDataPoint>>('rect')
      .data(d => d, d => d.data.id as string);

    // EXIT
    rects.exit()
      .transition().duration(300)
      .attr('y', d => y(d[0])) // Shrink to bottom of its specific stack
      .attr('height', 0)
      .remove();

    // ENTER
    const enterRects = rects.enter()
      .append('rect')
      .attr('x', d => x(d.data.category) || 0)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d[0])) // Start drawing at the bottom edge of this segment's baseline
      .attr('height', 0)       // Start invisible
      .style('cursor', 'pointer');

    // ANIMATE ENTER
    enterRects.transition()
      .duration(700)
      .delay((d, i) => i * 50) // Staggered by category column
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d[1])) // Move up to its top edge
      .attr('height', d => y(d[0]) - y(d[1])); // Height is baseline minus top edge

    // ANIMATE UPDATE (Moving existing rects)
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
        // Dim all other rects
        stacksGroup.selectAll('rect')
          .transition().duration(200)
          .attr('opacity', 0.4);

        // Highlight this specific stack segment
        d3.select(this)
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
      })
      .on('mouseleave', function () {
        // Restore all
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

export default AnimatedStackedBarChart;