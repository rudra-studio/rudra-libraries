import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface CandlestickDataPoint {
  id: string | number;
  date: string; // e.g., "2023-10-01" or a formatted string like "Oct 1"
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface AnimatedCandlestickChartProps {
  /** The OHLC dataset. */
  data?: CandlestickDataPoint[]; /* @array */ /* @binding */

  /** Color for days where Close > Open (default: Emerald Green) */
  colorBullish?: string; 

  /** Color for days where Open > Close (default: Red) */
  colorBearish?: string; 

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedCandlestickChart: React.FC<AnimatedCandlestickChartProps> = ({
  data = [
    { id: 1, date: 'Oct 1', open: 120, high: 125, low: 115, close: 122 },
    { id: 2, date: 'Oct 2', open: 122, high: 130, low: 120, close: 128 },
    { id: 3, date: 'Oct 3', open: 128, high: 132, low: 125, close: 126 }, // Bearish
    { id: 4, date: 'Oct 4', open: 126, high: 127, low: 118, close: 119 }, // Bearish
    { id: 5, date: 'Oct 5', open: 119, high: 135, low: 115, close: 133 },
    { id: 6, date: 'Oct 6', open: 133, high: 140, low: 130, close: 138 },
    { id: 7, date: 'Oct 7', open: 138, high: 142, low: 135, close: 136 }, // Bearish
  ],
  colorBullish = '#10b981', // emerald-500
  colorBearish = '#ef4444', // red-500
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
    if (!svgRef.current || dimensions.width === 0 || data.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // --- SCALES ---
    // We use scaleBand for X to easily center the wicks and size the bodies, 
    // and to skip weekends automatically (unlike scaleTime which leaves blank gaps).
    const x = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([marginLeft, width - marginRight])
      .padding(0.25); // Space between candlesticks

    // Find the absolute highest high and lowest low across the dataset
    const yMin = d3.min(data, d => d.low) || 0;
    const yMax = d3.max(data, d => d.high) || 100;

    // Buffer the top and bottom slightly so the extreme wicks don't clip the axes
    const buffer = (yMax - yMin) * 0.1; 
    
    const y = d3.scaleLinear()
      .domain([Math.max(0, yMin - buffer), yMax + buffer])
      .nice()
      .range([height - marginBottom, marginTop]);

    // Helper function to determine if a day is bullish (up) or bearish (down)
    const isBullish = (d: CandlestickDataPoint) => d.close >= d.open;

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
      .call(d3.axisLeft(y)
        .ticks(6)
        .tickFormat(d => `$${d}`)
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

    // --- DRAWING THE WICKS (High/Low Lines) ---
    let wicksGroup = svg.select<SVGGElement>('.wicks-group');
    if (wicksGroup.empty()) {
      wicksGroup = svg.append('g').attr('class', 'wicks-group');
    }

    const wicks = wicksGroup.selectAll<SVGLineElement, CandlestickDataPoint>('.wick')
      .data(data, d => d.id);

    wicks.exit().remove();

    const enterWicks = wicks.enter()
      .append('line')
      .attr('class', 'wick')
      .attr('x1', d => (x(d.date) || 0) + x.bandwidth() / 2)
      .attr('x2', d => (x(d.date) || 0) + x.bandwidth() / 2)
      .attr('y1', d => y(d.open)) // Start animation from the open price
      .attr('y2', d => y(d.open))
      .attr('stroke', d => isBullish(d) ? colorBullish : colorBearish)
      .attr('stroke-width', 2);

    // ANIMATE WICKS (Stretch outwards from open to high/low)
    enterWicks.transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr('y1', d => y(d.high))
      .attr('y2', d => y(d.low));

    // UPDATE WICKS
    wicks.transition()
      .duration(750)
      .attr('x1', d => (x(d.date) || 0) + x.bandwidth() / 2)
      .attr('x2', d => (x(d.date) || 0) + x.bandwidth() / 2)
      .attr('y1', d => y(d.high))
      .attr('y2', d => y(d.low))
      .attr('stroke', d => isBullish(d) ? colorBullish : colorBearish);

    // --- DRAWING THE BODIES (Open/Close Rectangles) ---
    let bodiesGroup = svg.select<SVGGElement>('.bodies-group');
    if (bodiesGroup.empty()) {
      bodiesGroup = svg.append('g').attr('class', 'bodies-group');
    }

    const bodies = bodiesGroup.selectAll<SVGRectElement, CandlestickDataPoint>('.body')
      .data(data, d => d.id);

    bodies.exit().remove();

    const enterBodies = bodies.enter()
      .append('rect')
      .attr('class', 'body')
      .attr('x', d => x(d.date) || 0)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.open)) // Start at open
      .attr('height', 0) // Start with 0 height
      .attr('fill', d => isBullish(d) ? colorBullish : colorBearish)
      .attr('rx', 2)
      .style('cursor', 'pointer');

    // ANIMATE BODIES (Expand out from the Open to the Close)
    enterBodies.transition()
      .duration(600)
      .delay(200) // Wait slightly for wicks to start drawing first!
      .ease(d3.easeCubicOut)
      .attr('y', d => y(Math.max(d.open, d.close))) // SVG draws top-down, so Y is always the higher value
      .attr('height', d => Math.max(2, Math.abs(y(d.open) - y(d.close)))); // Enforce minimum 2px height so flat days are visible

    // UPDATE BODIES
    bodies.transition()
      .duration(750)
      .attr('x', d => x(d.date) || 0)
      .attr('width', x.bandwidth())
      .attr('y', d => y(Math.max(d.open, d.close)))
      .attr('height', d => Math.max(2, Math.abs(y(d.open) - y(d.close))))
      .attr('fill', d => isBullish(d) ? colorBullish : colorBearish);

    // --- HOVER INTERACTIONS ---
    // We group the hover logic so hovering the body highlights both body and wick
    enterBodies.merge(bodies)
      .on('mouseenter', function (event, hoveredData) {
        // Dim all
        bodiesGroup.selectAll('.body').transition().duration(200).attr('opacity', 0.4);
        wicksGroup.selectAll('.wick').transition().duration(200).attr('opacity', 0.4);

        // Highlight this specific body and its matching wick
        d3.select(this)
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('filter', 'brightness(1.1)');
          
        wicksGroup.selectAll('.wick')
          .filter((d: any) => d.id === hoveredData.id)
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3);
      })
      .on('mouseleave', function () {
        // Restore all
        bodiesGroup.selectAll('.body')
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('filter', 'none');
          
        wicksGroup.selectAll('.wick')
          .transition().duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 2);
      });

  }, [data, dimensions, colorBullish, colorBearish, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[350px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedCandlestickChart;