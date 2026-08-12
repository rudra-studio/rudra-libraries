import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface ScatterDataPoint {
  id: string | number;
  x: number; // e.g., Advertising Spend ($)
  y: number; // e.g., Customer Acquisition Cost
  category?: string; // e.g., "Q1", "Q2", or "North America", "Europe"
  label?: string; // Optional label for tooltips
}

export interface AnimatedScatterPlotProps {
  /** The dataset */
  data?: ScatterDataPoint[];

  /** Default palette for the categories */
  themeColors?: string[];

  /** Base radius of the dots */
  dotRadius?: number;

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedScatterPlot: React.FC<AnimatedScatterPlotProps> = ({
  data = [
    { id: 1, x: 120, y: 80, category: 'Group A', label: 'Campaign 1' },
    { id: 2, x: 250, y: 110, category: 'Group A', label: 'Campaign 2' },
    { id: 3, x: 340, y: 150, category: 'Group B', label: 'Campaign 3' },
    { id: 4, x: 480, y: 210, category: 'Group B', label: 'Campaign 4' },
    { id: 5, x: 590, y: 180, category: 'Group C', label: 'Campaign 5' },
    { id: 6, x: 720, y: 250, category: 'Group C', label: 'Campaign 6' },
    { id: 7, x: 810, y: 310, category: 'Group A', label: 'Campaign 7' },
    { id: 8, x: 950, y: 290, category: 'Group B', label: 'Campaign 8' },
  ],
  themeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  dotRadius = 6,
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

    // --- SCALES ---
    const xMax = d3.max(data, d => d.x) || 100;
    const yMax = d3.max(data, d => d.y) || 100;

    const x = d3.scaleLinear()
      .domain([0, xMax * 1.1]).nice()
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, yMax * 1.1]).nice()
      .range([height - marginBottom, marginTop]);

    const categories = Array.from(new Set(data.map(d => d.category || 'default')));
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
        .ticks(8)
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

    // --- DRAWING THE SCATTER DOTS ---
    let dotsGroup = svg.select<SVGGElement>('.dots-group');
    if (dotsGroup.empty()) {
      dotsGroup = svg.append('g').attr('class', 'dots-group');
    }

    const dots = dotsGroup.selectAll<SVGCircleElement, ScatterDataPoint>('.scatter-dot')
      .data(data, d => d.id);

    // 1. EXIT: Remove old dots
    dots.exit()
      .transition().duration(300)
      .attr('r', 0)
      .remove();

    // 2. ENTER: Set up new dots (starting at 0 radius)
    const enterDots = dots.enter()
      .append('circle')
      .attr('class', 'scatter-dot')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 0) 
      .attr('fill', d => colorScale(d.category || 'default'))
      .attr('opacity', 0.8)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer');

    // 3. ENTER ANIMATION: Pop-in only for the newly added dots
    enterDots.transition()
      .duration(600)
      .delay((d, i) => i * 40)
      .ease(d3.easeBackOut.overshoot(1.5))
      .attr('r', dotRadius);

    // 4. UPDATE ANIMATION: Move ONLY the existing dots (prevents cancelling the enter animation)
    dots.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('fill', d => colorScale(d.category || 'default'))
      .attr('r', dotRadius);

    // 5. HOVER INTERACTIONS: Apply listeners to ALL dots (both new and existing)
    enterDots.merge(dots)
      .on('mouseenter', function () {
        // Dim others
        dotsGroup.selectAll('.scatter-dot').transition().duration(200).attr('opacity', 0.3);

        // Emphasize this one
        d3.select(this)
          .raise() // Brings dot to the front
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('r', dotRadius * 1.5)
          .attr('stroke-width', 3);
      })
      .on('mouseleave', function () {
        // Restore all
        dotsGroup.selectAll('.scatter-dot')
          .transition().duration(200)
          .attr('opacity', 0.8)
          .attr('r', dotRadius)
          .attr('stroke-width', 1.5);
      });

  }, [data, dimensions, dotRadius, themeColors, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[350px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedScatterPlot;