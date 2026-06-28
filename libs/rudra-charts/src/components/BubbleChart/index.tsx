import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface BubbleDataPoint {
  id: string | number;
  x: number; // e.g., Advertising Spend
  y: number; // e.g., Customer Acquisition Cost
  z: number; // e.g., Total Revenue (Determines bubble size)
  category: string; // e.g., "North America", "Europe"
  label?: string;
}

export interface AnimatedBubbleChartProps {
  /** The dataset containing x, y, and z values. */
  data?: BubbleDataPoint[]; /* @array */ /* @binding */

  /** Default palette for the categories */
  themeColors?: string[]; /* @complex|{"type":"array","items":{"type":"string"}} */

  /** The maximum radius (in pixels) for the largest bubble in the dataset */
  maxRadius?: number;

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedBubbleChart: React.FC<AnimatedBubbleChartProps> = ({
  data = [
    { id: 1, x: 1200, y: 80, z: 15000, category: 'Group A', label: 'Campaign 1' },
    { id: 2, x: 2500, y: 110, z: 42000, category: 'Group A', label: 'Campaign 2' },
    { id: 3, x: 3400, y: 150, z: 31000, category: 'Group B', label: 'Campaign 3' },
    { id: 4, x: 4800, y: 210, z: 86000, category: 'Group B', label: 'Campaign 4' },
    { id: 5, x: 5900, y: 180, z: 54000, category: 'Group C', label: 'Campaign 5' },
    { id: 6, x: 7200, y: 250, z: 98000, category: 'Group C', label: 'Campaign 6' },
    { id: 7, x: 8100, y: 310, z: 22000, category: 'Group A', label: 'Campaign 7' },
    { id: 8, x: 9500, y: 290, z: 115000, category: 'Group B', label: 'Campaign 8' },
  ],
  themeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  maxRadius = 35,
  marginTop = 20,
  marginBottom = 40,
  marginLeft = 50,
  marginRight = 40, // Extra right margin so large bubbles don't clip
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });

  // 1. Responsive Canvas Observer
  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height || 400
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
    const xMax = d3.max(data, d => d.x) || 100;
    const yMax = d3.max(data, d => d.y) || 100;
    const zMax = d3.max(data, d => d.z) || 100;

    // Linear scales for position
    const x = d3.scaleLinear()
      .domain([0, xMax * 1.1]).nice()
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, yMax * 1.1]).nice()
      .range([height - marginBottom, marginTop]);

    // Square Root scale for area-proportional sizing
    const z = d3.scaleSqrt()
      .domain([0, zMax])
      .range([2, maxRadius]); // Minimum radius of 2px, up to maxRadius

    const categories = Array.from(new Set(data.map(d => d.category)));
    const colorScale = d3.scaleOrdinal<string>()
      .domain(categories)
      .range(themeColors);

    // --- AXES & GRID LINES ---
    if (svg.select('.x-axis').empty()) {
      svg.append('g').attr('class', 'axis x-axis');
      svg.append('g').attr('class', 'axis y-axis');
    }

    svg.select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .transition().duration(500)
      .call(d3.axisBottom(x).ticks(8).tickSize(-(height - marginTop - marginBottom)))
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke-opacity', 0.1));

    svg.select<SVGGElement>('.y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .transition().duration(500)
      .call(d3.axisLeft(y).ticks(6).tickSize(-(width - marginLeft - marginRight)))
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke-opacity', 0.1));

    // --- DRAWING THE BUBBLES ---
    let bubblesGroup = svg.select<SVGGElement>('.bubbles-group');
    if (bubblesGroup.empty()) {
      bubblesGroup = svg.append('g').attr('class', 'bubbles-group');
    }

    const bubbles = bubblesGroup.selectAll<SVGCircleElement, BubbleDataPoint>('.bubble')
      .data(data, d => d.id);

    // EXIT
    bubbles.exit()
      .transition().duration(300)
      .attr('r', 0)
      .remove();

    // ENTER
    const enterBubbles = bubbles.enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 0) // Start at 0 for pop-in animation
      .attr('fill', d => colorScale(d.category))
      .attr('opacity', 0.7) // Slightly transparent so overlapping bubbles are visible
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer');

    // ENTER ANIMATION
    enterBubbles.transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .ease(d3.easeElasticOut.amplitude(1).period(0.5)) // Very satisfying pop-in
      .attr('r', d => z(d.z));

    // UPDATE ANIMATION
    bubbles.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', d => z(d.z))
      .attr('fill', d => colorScale(d.category));

    // HOVER INTERACTIONS
    enterBubbles.merge(bubbles)
      .on('mouseenter', function () {
        // Dim others
        bubblesGroup.selectAll('.bubble')
          .transition().duration(200)
          .attr('opacity', 0.2);

        // Highlight this one
        d3.select(this)
          .raise() // Bring to front
          .transition().duration(200)
          .attr('opacity', 0.9)
          .attr('stroke-width', 3);
      })
      .on('mouseleave', function () {
        // Restore all
        bubblesGroup.selectAll('.bubble')
          .transition().duration(200)
          .attr('opacity', 0.7)
          .attr('stroke-width', 1.5);
      });

  }, [data, dimensions, maxRadius, themeColors, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[400px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedBubbleChart;