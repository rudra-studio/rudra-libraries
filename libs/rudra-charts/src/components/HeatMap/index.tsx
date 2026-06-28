import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface HeatmapDataPoint {
  id: string | number;
  xCategory: string; // e.g., "Mon", "Tue", "Wed"
  yCategory: string; // e.g., "Morning", "Afternoon", "Evening"
  value: number;     // e.g., Number of visitors
}

export interface AnimatedHeatmapProps {
  /** The matrix dataset. */
  data?: HeatmapDataPoint[]; /* @array */ /* @binding */

  /** * A two-color array representing the lowest and highest value colors. 
   * D3 will automatically interpolate all the shades in between.
   */
  colorRange?: [string, string]; /* @complex|{"type":"array","items":{"type":"string"}} */

  /** Space between the matrix cells */
  cellPadding?: number;

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedHeatmap: React.FC<AnimatedHeatmapProps> = ({
  data = [
    // Simulating a weekly activity heatmap
    { id: 1, xCategory: 'Mon', yCategory: 'Morning', value: 12 },
    { id: 2, xCategory: 'Mon', yCategory: 'Afternoon', value: 45 },
    { id: 3, xCategory: 'Mon', yCategory: 'Evening', value: 78 },
    { id: 4, xCategory: 'Tue', yCategory: 'Morning', value: 15 },
    { id: 5, xCategory: 'Tue', yCategory: 'Afternoon', value: 50 },
    { id: 6, xCategory: 'Tue', yCategory: 'Evening', value: 92 },
    { id: 7, xCategory: 'Wed', yCategory: 'Morning', value: 18 },
    { id: 8, xCategory: 'Wed', yCategory: 'Afternoon', value: 65 },
    { id: 9, xCategory: 'Wed', yCategory: 'Evening', value: 85 },
    { id: 10, xCategory: 'Thu', yCategory: 'Morning', value: 20 },
    { id: 11, xCategory: 'Thu', yCategory: 'Afternoon', value: 70 },
    { id: 12, xCategory: 'Thu', yCategory: 'Evening', value: 110 },
    { id: 13, xCategory: 'Fri', yCategory: 'Morning', value: 25 },
    { id: 14, xCategory: 'Fri', yCategory: 'Afternoon', value: 85 },
    { id: 15, xCategory: 'Fri', yCategory: 'Evening', value: 140 },
  ],
  colorRange = ['#f1f5f9', '#3b82f6'], // slate-100 to blue-500
  cellPadding = 0.08,
  marginTop = 20,
  marginBottom = 30,
  marginLeft = 70, // Extra room for Y-axis labels
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
    if (!svgRef.current || dimensions.width === 0 || data.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // --- SCALES ---
    // Extract unique rows and columns
    const xCategories = Array.from(new Set(data.map(d => d.xCategory)));
    const yCategories = Array.from(new Set(data.map(d => d.yCategory)));
    
    // Find absolute min and max for the color interpolation
    const minVal = d3.min(data, d => d.value) || 0;
    const maxVal = d3.max(data, d => d.value) || 100;

    const x = d3.scaleBand()
      .domain(xCategories)
      .range([marginLeft, width - marginRight])
      .padding(cellPadding);

    const y = d3.scaleBand()
      .domain(yCategories)
      .range([marginTop, height - marginBottom])
      .padding(cellPadding);

    // The Color Interpolator (Maps data values directly to CSS color strings)
    const colorScale = d3.scaleLinear<string>()
      .domain([minVal, maxVal])
      .range(colorRange);

    // --- AXES ---
    if (svg.select('.x-axis').empty()) {
      svg.append('g').attr('class', 'axis x-axis');
      svg.append('g').attr('class', 'axis y-axis');
    }

    // X Axis (Top or Bottom, usually Bottom for Heatmaps)
    svg.select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .transition().duration(500)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove()) // Remove baseline
      .call(g => g.selectAll('.tick line').remove()); // Remove tick marks for a cleaner grid look

    // Y Axis
    svg.select<SVGGElement>('.y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .transition().duration(500)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove());

    // --- DRAWING THE CELLS ---
    let cellsGroup = svg.select<SVGGElement>('.cells-group');
    if (cellsGroup.empty()) {
      cellsGroup = svg.append('g').attr('class', 'cells-group');
    }

    const cells = cellsGroup.selectAll<SVGRectElement, HeatmapDataPoint>('.cell')
      .data(data, d => d.id);

    // EXIT
    cells.exit()
      .transition().duration(300)
      .attr('opacity', 0)
      .remove();

    // ENTER
    const enterCells = cells.enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => x(d.xCategory) || 0)
      .attr('y', d => y(d.yCategory) || 0)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d => colorScale(d.value))
      .attr('rx', 6) // Beautiful rounded corners
      .attr('ry', 6)
      .attr('opacity', 0) // Start invisible
      .style('cursor', 'pointer');

    // ENTER ANIMATION (Cascading diagonal fade-in)
    enterCells.transition()
      .duration(600)
      // Delay based on both X and Y index to create a wave effect from top-left to bottom-right
      .delay(d => {
         const xIdx = xCategories.indexOf(d.xCategory);
         const yIdx = yCategories.indexOf(d.yCategory);
         return (xIdx + yIdx) * 40; 
      })
      .ease(d3.easeCubicOut)
      .attr('opacity', 1);

    // UPDATE ANIMATION
    cells.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('x', d => x(d.xCategory) || 0)
      .attr('y', d => y(d.yCategory) || 0)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d => colorScale(d.value));

    // HOVER INTERACTIONS
    enterCells.merge(cells)
      .on('mouseenter', function () {
        // Dim all other cells slightly
        cellsGroup.selectAll('.cell')
          .transition().duration(200)
          .attr('opacity', 0.5);

        // Highlight this one, add a border, and bring to front
        d3.select(this)
          .raise()
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('stroke', '#0f172a') // slate-900 border
          .attr('stroke-width', 2);
      })
      .on('mouseleave', function () {
        // Restore all cells
        cellsGroup.selectAll('.cell')
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('stroke', 'none');
      });

  }, [data, dimensions, colorRange, cellPadding, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[350px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedHeatmap;