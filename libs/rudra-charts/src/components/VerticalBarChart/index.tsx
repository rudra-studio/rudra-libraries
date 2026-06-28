import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface ColumnDataPoint {
  id: string | number;
  category: string; // e.g., "Jan", "Feb", "Mar"
  value: number;
}

export interface AnimatedVerticalBarChartProps {
  /** The categorical dataset. */
  data?: ColumnDataPoint[]; /* @array */ /* @binding */

  /** Default palette for the bars */
  themeColors?: string[]; /* @complex|{"type":"array","items":{"type":"string"}} */

  /** Show the exact number on top of each bar */
  showValues?: boolean;

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedVerticalBarChart: React.FC<AnimatedVerticalBarChartProps> = ({
  data = [
    { id: '1', category: 'Jan', value: 420 },
    { id: '2', category: 'Feb', value: 580 },
    { id: '3', category: 'Mar', value: 310 },
    { id: '4', category: 'Apr', value: 850 },
    { id: '5', category: 'May', value: 650 },
    { id: '6', category: 'Jun', value: 940 },
  ],
  themeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
  showValues = true,
  marginTop = 40, // Extra top margin to fit the value labels
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
    if (!svgRef.current || dimensions.width === 0 || data.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // --- SCALES ---
    const categories = data.map(d => d.category);
    const yMax = d3.max(data, d => d.value) || 100;

    // Band scale for discrete categories (X Axis)
    const x = d3.scaleBand()
      .domain(categories)
      .range([marginLeft, width - marginRight])
      .padding(0.25); // Controls the gap between bars

    // Linear scale for values (Y Axis)
    const y = d3.scaleLinear()
      .domain([0, yMax * 1.1]) // 10% headroom
      .nice()
      .range([height - marginBottom, marginTop]);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(categories)
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
      .call(g => g.select('.domain').remove()); // Clean look, no heavy baseline

    // Y Axis (with horizontal grid lines)
    svg.select<SVGGElement>('.y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .transition().duration(500)
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-(width - marginLeft - marginRight))
      )
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line')
        .attr('stroke-opacity', 0.1)
        .attr('stroke-dasharray', '4,4') // Dashed gridlines
      );

    // --- BARS ---
    let barsGroup = svg.select<SVGGElement>('.bars-group');
    if (barsGroup.empty()) {
      barsGroup = svg.append('g').attr('class', 'bars-group');
    }

    const bars = barsGroup.selectAll<SVGRectElement, ColumnDataPoint>('.bar')
      .data(data, d => d.id);

    // EXIT
    bars.exit()
      .transition().duration(300)
      .attr('y', y(0))
      .attr('height', 0)
      .remove();

    // ENTER
    const enterBars = bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.category) || 0)
      .attr('width', x.bandwidth())
      .attr('y', y(0)) // Start at bottom for animation
      .attr('height', 0) // Start with 0 height
      .attr('fill', d => colorScale(d.category))
      .attr('rx', 4) // Rounded top corners
      .attr('ry', 4)
      .style('cursor', 'pointer');

    // ENTER ANIMATION
    enterBars.transition()
      .duration(700)
      .delay((_, i) => i * 50) // Staggered growth
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value));

    // UPDATE ANIMATION
    bars.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('x', d => x(d.category) || 0)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value))
      .attr('fill', d => colorScale(d.category));

    // HOVER INTERACTIONS
    enterBars.merge(bars)
      .on('mouseenter', function () {
        barsGroup.selectAll('.bar')
          .transition().duration(200)
          .attr('opacity', 0.4);

        d3.select(this)
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('filter', 'brightness(1.1)'); // Slight brighten on hover
      })
      .on('mouseleave', function () {
        barsGroup.selectAll('.bar')
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('filter', 'none');
      });

    // --- VALUE LABELS ---
    let labelsGroup = svg.select<SVGGElement>('.labels-group');
    if (labelsGroup.empty()) {
      labelsGroup = svg.append('g').attr('class', 'labels-group');
    }

    const labels = labelsGroup.selectAll<SVGTextElement, ColumnDataPoint>('.value-label')
      .data(showValues ? data : [], d => d.id);

    // EXIT
    labels.exit()
      .transition().duration(300)
      .attr('y', y(0))
      .style('opacity', 0)
      .remove();

    // ENTER
    const enterLabels = labels.enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => (x(d.category) || 0) + x.bandwidth() / 2)
      .attr('y', y(0))
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('fill', '#475569') // Slate-600
      .style('opacity', 0)
      .style('pointer-events', 'none')
      .text(d => d.value.toLocaleString()); // Format with commas

    // ENTER ANIMATION
    enterLabels.transition()
      .duration(700)
      .delay((_, i) => i * 50)
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d.value) - 8) // Float 8px above the bar
      .style('opacity', 1);

    // UPDATE ANIMATION
    labels.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('x', d => (x(d.category) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 8)
      .text(d => d.value.toLocaleString());

  }, [data, dimensions, themeColors, showValues, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[350px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedVerticalBarChart;