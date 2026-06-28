import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface HorizontalChartData {
  label: string; // E.g., "United States", "Enterprise Customers"
  value: number; // E.g., 45000
}

export interface AnimatedHorizontalBarChartProps {
  /** The dataset */
  data?: HorizontalChartData[]; /* @binding */

  /** Visual customization */
  barColor?: string; /* @color */
  hoverColor?: string; /* @color */

  /** Format the number label (e.g., '$' or '%') */
  valuePrefix?: string;
  valueSuffix?: string;

  // Margins - Notice marginLeft is much larger by default to accommodate long text labels!
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedHorizontalBarChart: React.FC<AnimatedHorizontalBarChartProps> = ({
  data = [
    { label: 'United States', value: 850 },
    { label: 'United Kingdom', value: 620 },
    { label: 'Germany', value: 480 },
    { label: 'Australia', value: 310 },
    { label: 'Japan', value: 250 },
  ],
  barColor = '#3b82f6', // blue-500
  hoverColor = '#2563eb', // blue-600
  valuePrefix = '',
  valueSuffix = '',
  marginTop = 20,
  marginBottom = 30,
  marginLeft = 120, // Huge left margin for text labels
  marginRight = 60, // Extra right margin for the floating numbers
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

    // --- DATA SORTING ---
    // Horizontal charts almost always look best sorted highest to lowest
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // --- SCALES ---
    // Note: X and Y are flipped compared to a vertical bar chart!
    const x = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.value) || 100]).nice()
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleBand()
      .domain(sortedData.map(d => d.label))
      .range([marginTop, height - marginBottom])
      .padding(0.25); // Thinner bars, more breathing room

    // --- AXES ---
    if (svg.select('.y-axis').empty()) {
      svg.append('g').attr('class', 'axis y-axis');
      svg.append('g').attr('class', 'axis x-axis');
    }

    // Y Axis (The Text Labels)
    svg.select<SVGGElement>('.y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .transition().duration(500)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .attr('font-size', '13px')
      .attr('font-weight', '500')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#334155') // slate-700
      .call(g => g.select('.domain').remove()) // Remove the vertical axis line completely!
      .call(g => g.selectAll('.tick line').remove()); // Remove tick marks

    // X Axis (The Numbers at bottom)
    svg.select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .transition().duration(500)
      .call(d3.axisBottom(x).ticks(5))
      .attr('font-size', '11px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#94a3b8') // slate-400
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line')
        .attr('y2', -(height - marginTop - marginBottom))
        .attr('stroke-opacity', 0.1) // Vertical grid lines!
      );

    // --- BARS ---
    let barsGroup = svg.select<SVGGElement>('.bars-group');
    if (barsGroup.empty()) barsGroup = svg.append('g').attr('class', 'bars-group');

    const bars = barsGroup.selectAll<SVGRectElement, HorizontalChartData>('.bar')
      .data(sortedData, d => d.label);

    // Exit
    bars.exit()
      .transition().duration(400)
      .attr('width', 0)
      .style('opacity', 0)
      .remove();

    // Enter
    const enterBars = bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', x(0)) // Start exactly at the 0 baseline
      .attr('y', d => y(d.label)!)
      .attr('height', y.bandwidth())
      .attr('width', 0) // Animate from 0 width
      .attr('fill', barColor)
      .attr('rx', 4) // Rounded right edges
      .attr('ry', 4);

    // Hover logic
    enterBars
      .on('mouseenter', function () {
        d3.select(this).transition().duration(200).attr('fill', hoverColor);
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(200).attr('fill', barColor);
      });

    // Update
    enterBars.merge(bars)
      .transition().duration(800).ease(d3.easeCubicOut)
      .attr('y', d => y(d.label)!)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d.value) - x(0))
      .attr('fill', barColor);

    // --- INLINE VALUE LABELS ---
    // We put the exact number right next to the growing bar
    let labelsGroup = svg.select<SVGGElement>('.labels-group');
    if (labelsGroup.empty()) labelsGroup = svg.append('g').attr('class', 'labels-group');

    const labels = labelsGroup.selectAll<SVGTextElement, HorizontalChartData>('.value-label')
      .data(sortedData, d => d.label);

    labels.exit().remove();

    const enterLabels = labels.enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', x(0) + 10)
      .attr('y', d => y(d.label)! + y.bandwidth() / 2)
      .attr('dy', '0.35em') // Vertically center text in the bandwidth
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('fill', '#64748b')
      .style('opacity', 0)
      .text(d => `${valuePrefix}${d.value}${valueSuffix}`);

    // Animate the text moving along with the tip of the bar!
    enterLabels.merge(labels)
      .transition().duration(800).ease(d3.easeCubicOut)
      .attr('y', d => y(d.label)! + y.bandwidth() / 2)
      .attr('x', d => x(d.value) + 10) // 10px to the right of the bar's end
      .style('opacity', 1)
      .text(d => `${valuePrefix}${d.value.toLocaleString()}${valueSuffix}`);

  }, [data, dimensions, barColor, hoverColor, valuePrefix, valueSuffix, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[300px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedHorizontalBarChart;