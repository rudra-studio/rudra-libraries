import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// --- DATA STRUCTURES ---
export interface StackedAreaDataPoint {
  x: string; // The X-axis label (e.g., 'Jan', 'Feb', '2023')
  [key: string]: any; // The categories to be stacked (e.g., Product A: 40, Product B: 60)
}

export interface AnimatedStackedAreaChartProps {
  /** The dataset */
  data?: StackedAreaDataPoint[]; /* @binding */

  /** The keys inside the data objects that should be stacked on top of each other */
  keys?: string[];

  /** Line curve style */
  curveType?: 'linear' | 'smooth' | 'step'; /* @select|linear|smooth|step */

  /** Default palette for the stacked layers */
  themeColors?: string[]; /* @complex|{"type":"array","items":{"type":"string"}} */

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedStackedAreaChart: React.FC<AnimatedStackedAreaChartProps> = ({
  data = [
    { x: 'Jan', 'Mobile': 30, 'Desktop': 20, 'Tablet': 10 },
    { x: 'Feb', 'Mobile': 40, 'Desktop': 30, 'Tablet': 15 },
    { x: 'Mar', 'Mobile': 35, 'Desktop': 45, 'Tablet': 25 },
    { x: 'Apr', 'Mobile': 50, 'Desktop': 40, 'Tablet': 30 },
    { x: 'May', 'Mobile': 65, 'Desktop': 55, 'Tablet': 40 },
  ],
  keys = ['Mobile', 'Desktop', 'Tablet'],
  curveType = 'smooth',
  themeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  marginTop = 20,
  marginBottom = 30,
  marginLeft = 50,
  marginRight = 20,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });

  // 1. Responsive Observer for Builder Canvas
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
    if (!svgRef.current || dimensions.width === 0 || data.length === 0 || keys.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // --- DATA PREPARATION ---
    // d3.stack calculates the baseline (y0) and top (y1) for each layer
    const stack = d3.stack<any>().keys(keys);
    const stackedData = stack(data);

    // Find the absolute maximum Y value to scale the chart
    const maxY = d3.max(stackedData, layer => d3.max(layer, d => d[1])) || 100;
    const xValues = data.map(d => d.x);

    // --- SCALES ---
    const x = d3.scalePoint()
      .domain(xValues)
      .range([marginLeft, width - marginRight])
      .padding(0); // 0 padding makes the area touch the very edges of the chart

    const y = d3.scaleLinear()
      .domain([0, maxY]).nice()
      .range([height - marginBottom, marginTop]);

    const colorScale = d3.scaleOrdinal<string>().domain(keys).range(themeColors);

    // --- AREA GENERATOR ---
    const areaGenerator = d3.area<any>()
      .x(d => x(d.data.x)!)
      .y0(d => y(d[0])) // Bottom of this specific stack layer
      .y1(d => y(d[1])); // Top of this specific stack layer

    // Apply the curve style
    if (curveType === 'smooth') areaGenerator.curve(d3.curveMonotoneX);
    else if (curveType === 'step') areaGenerator.curve(d3.curveStepAfter);
    else areaGenerator.curve(d3.curveLinear);

    // --- AXES ---
    if (svg.select('.x-axis').empty()) {
      svg.append('g').attr('class', 'axis x-axis');
      svg.append('g').attr('class', 'axis y-axis');
    }

    // X Axis
    svg.select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .transition().duration(500)
      .call(d3.axisBottom(x))
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b');

    // Y Axis
    svg.select<SVGGElement>('.y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .transition().duration(500)
      .call(d3.axisLeft(y).ticks(6))
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line')
        .attr('x2', width - marginLeft - marginRight)
        .attr('stroke-opacity', 0.1) // Subtle grid lines
      );

    // --- CLIP PATH FOR ANIMATION ---
    // We create a rectangle that acts as a "window". Anything outside it is hidden.
    let defs = svg.select('defs');
    if (defs.empty()) defs = svg.append('defs');

    let clipPath = defs.select('#area-clip');
    if (clipPath.empty()) {
      clipPath = defs.append('clipPath').attr('id', 'area-clip');
      clipPath.append('rect')
        .attr('x', marginLeft)
        .attr('y', 0)
        .attr('width', 0) // Start with 0 width for the reveal
        .attr('height', height);
    }

    // Animate the "window" opening from left to right
    clipPath.select('rect')
      .transition()
      .duration(1200)
      .ease(d3.easeCubicInOut)
      .attr('width', width - marginLeft);

    // --- DRAWING THE AREAS ---
    let areasGroup = svg.select<SVGGElement>('.areas-group');
    if (areasGroup.empty()) {
      areasGroup = svg.append('g')
        .attr('class', 'areas-group')
        .attr('clip-path', 'url(#area-clip)'); // Apply the clipping window
    }

    const layers = areasGroup.selectAll<SVGPathElement, any>('.area-layer')
      .data(stackedData, d => d.key);

    // EXIT
    layers.exit()
      .transition().duration(400)
      .style('opacity', 0)
      .remove();

    // ENTER
    const enterLayers = layers.enter()
      .append('path')
      .attr('class', 'area-layer')
      .attr('fill', d => colorScale(d.key))
      .attr('opacity', 0.8) // Slight transparency looks better in stacked charts
      .attr('d', areaGenerator);

    // Interactive Hover Effect
    enterLayers
      .on('mouseenter', function () {
        // Dim all other layers
        areasGroup.selectAll('.area-layer').transition().duration(200).attr('opacity', 0.2);
        // Highlight this one
        d3.select(this).transition().duration(200).attr('opacity', 1);
      })
      .on('mouseleave', function () {
        // Restore all
        areasGroup.selectAll('.area-layer').transition().duration(200).attr('opacity', 0.8);
      });

    // UPDATE
    enterLayers.merge(layers)
      .transition().duration(750).ease(d3.easeCubicOut)
      .attr('d', areaGenerator)
      .attr('fill', d => colorScale(d.key));

  }, [data, keys, dimensions, curveType, themeColors, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[300px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedStackedAreaChart;