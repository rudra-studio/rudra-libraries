import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface HistogramDataPoint {
  id: string | number;
  value: number; // The continuous variable (e.g., user age, session duration, purchase amount)
}

export interface AnimatedHistogramProps {
  /** The raw, continuous dataset to be binned. */
  data?: HistogramDataPoint[]; /* @array */ /* @binding */

  /** Default palette (uses the first color for the bins) */
  themeColors?: string[]; /* @complex|{"type":"array","items":{"type":"string"}} */

  /** The approximate number of bins (columns) to divide the data into */
  targetBins?: number;

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedHistogram: React.FC<AnimatedHistogramProps> = ({
  data = [
    // Simulating a bell-curve distribution (e.g., ages of users)
    { id: 1, value: 18 }, { id: 2, value: 19 }, { id: 3, value: 21 },
    { id: 4, value: 22 }, { id: 5, value: 22 }, { id: 6, value: 23 },
    { id: 7, value: 24 }, { id: 8, value: 24 }, { id: 9, value: 24 },
    { id: 10, value: 25 }, { id: 11, value: 25 }, { id: 12, value: 26 },
    { id: 13, value: 26 }, { id: 14, value: 27 }, { id: 15, value: 28 },
    { id: 16, value: 28 }, { id: 17, value: 29 }, { id: 18, value: 31 },
    { id: 19, value: 32 }, { id: 20, value: 35 }, { id: 21, value: 38 },
    { id: 22, value: 42 }, { id: 23, value: 45 }, { id: 24, value: 55 },
  ],
  themeColors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  targetBins = 10,
  marginTop = 20,
  marginBottom = 40,
  marginLeft = 40,
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

    // --- SCALES & BINNING ---
    // 1. Find the min and max of our raw data
    const xDomain = d3.extent(data, d => d.value) as [number, number];

    // 2. Create the X Scale (Linear, because it's a continuous range)
    const x = d3.scaleLinear()
      .domain(xDomain).nice()
      .range([marginLeft, width - marginRight]);

    // 3. Set up the D3 Bin generator
    const histogram = d3.bin<HistogramDataPoint, number>()
      .value(d => d.value)
      .domain(x.domain() as [number, number])
      .thresholds(x.ticks(targetBins)); // Asks D3 to aim for this many bins

    // 4. Generate the Bins (groups the data)
    const bins = histogram(data);

    // 5. Create the Y Scale based on the highest frequency (length) of the bins
    const yMax = d3.max(bins, d => d.length) || 10;
    const y = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([height - marginBottom, marginTop]);

    // --- AXES & GRID ---
    if (svg.select('.x-axis').empty()) {
      svg.append('g').attr('class', 'axis x-axis');
      svg.append('g').attr('class', 'axis y-axis');
    }

    // X Axis
    svg.select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .transition().duration(500)
      .call(d3.axisBottom(x).ticks(targetBins))
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove());

    // Y Axis
    svg.select<SVGGElement>('.y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .transition().duration(500)
      .call(d3.axisLeft(y)
        .ticks(Math.min(yMax, 5)) // Don't show decimal ticks if count is low
        .tickFormat(d3.format("d")) // Force integer format for counts
        .tickSize(-(width - marginLeft - marginRight))
      )
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line')
        .attr('stroke-opacity', 0.1)
        .attr('stroke-dasharray', '4,4')
      );

    // --- DRAWING THE BINS (BARS) ---
    let binsGroup = svg.select<SVGGElement>('.bins-group');
    if (binsGroup.empty()) {
      binsGroup = svg.append('g').attr('class', 'bins-group');
    }

    // We use the start of the bin (x0) as the React key to track them
    const bars = binsGroup.selectAll<SVGRectElement, d3.Bin<HistogramDataPoint, number>>('.bin')
      .data(bins, d => d.x0 || 0);

    // EXIT
    bars.exit()
      .transition().duration(300)
      .attr('y', y(0))
      .attr('height', 0)
      .remove();

    // ENTER
    const enterBars = bars.enter()
      .append('rect')
      .attr('class', 'bin')
      .attr('x', d => x(d.x0 || 0) + 1) // +1 creates a 1px gap between continuous bins
      .attr('width', d => Math.max(0, x(d.x1 || 0) - x(d.x0 || 0) - 1))
      .attr('y', y(0))
      .attr('height', 0)
      .attr('fill', themeColors[0]) // Use the primary theme color
      .attr('rx', 2)
      .style('cursor', 'pointer');

    // ENTER ANIMATION
    enterBars.transition()
      .duration(700)
      .delay((_, i) => i * 30) // Sweep in from the left
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d.length))
      .attr('height', d => y(0) - y(d.length));

    // UPDATE ANIMATION
    bars.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('x', d => x(d.x0 || 0) + 1)
      .attr('width', d => Math.max(0, x(d.x1 || 0) - x(d.x0 || 0) - 1))
      .attr('y', d => y(d.length))
      .attr('height', d => y(0) - y(d.length))
      .attr('fill', themeColors[0]);

    // HOVER INTERACTIONS
    enterBars.merge(bars)
      .on('mouseenter', function () {
        binsGroup.selectAll('.bin')
          .transition().duration(200)
          .attr('opacity', 0.4);
        
        d3.select(this)
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('filter', 'brightness(1.1)');
      })
      .on('mouseleave', function () {
        binsGroup.selectAll('.bin')
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('filter', 'none');
      });

  }, [data, dimensions, targetBins, themeColors, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[350px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedHistogram;