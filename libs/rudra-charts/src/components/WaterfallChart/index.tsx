import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface WaterfallDataPoint {
  id: string | number;
  label: string; // e.g., "Starting Cash", "Revenue", "Taxes"
  value: number; // The positive or negative change
  isTotal?: boolean; // If true, it anchors to 0 to show a final/starting sum
}

export interface AnimatedWaterfallChartProps {
  /** The sequence of positive and negative changes. */
  data?: WaterfallDataPoint[]; /* @array */ /* @binding */

  /** Color for positive values (default: Emerald Green) */
  colorPositive?: string;

  /** Color for negative values (default: Red) */
  colorNegative?: string;

  /** Color for total/anchor columns (default: Blue) */
  colorTotal?: string;

  /** Draw thin connector lines between the steps */
  showConnectorLines?: boolean;

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedWaterfallChart: React.FC<AnimatedWaterfallChartProps> = ({
  data = [
    { id: 1, label: 'Gross Revenue', value: 125000, isTotal: true },
    { id: 2, label: 'Cost of Goods', value: -45000 },
    { id: 3, label: 'Gross Margin', value: 0, isTotal: true }, // We will calculate this automatically
    { id: 4, label: 'Marketing', value: -15000 },
    { id: 5, label: 'Sales', value: -22000 },
    { id: 6, label: 'Investments', value: 8000 },
    { id: 7, label: 'Taxes', value: -9000 },
    { id: 8, label: 'Net Profit', value: 0, isTotal: true },
  ],
  colorPositive = '#10b981', // emerald-500
  colorNegative = '#ef4444', // red-500
  colorTotal = '#3b82f6',    // blue-500
  showConnectorLines = true,
  marginTop = 40, // Space for top labels
  marginBottom = 40,
  marginLeft = 60,
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

    // --- DATA PREPROCESSING (The Running Total) ---
    let runningTotal = 0;
    const processedData = data.map((d) => {
      if (d.isTotal) {
        // A total column spans from 0 to the current running total.
        // Even if the user passes `value: 0`, we override it with the actual math.
        const currentTotal = d.value !== 0 && runningTotal === 0 ? d.value : runningTotal;
        runningTotal = currentTotal; // reset/anchor running total just in case
        return {
          ...d,
          start: 0,
          end: currentTotal,
          color: colorTotal,
          displayValue: currentTotal
        };
      } else {
        const start = runningTotal;
        runningTotal += d.value;
        const end = runningTotal;
        return {
          ...d,
          start: start,
          end: end,
          color: d.value >= 0 ? colorPositive : colorNegative,
          displayValue: d.value
        };
      }
    });

    // --- SCALES ---
    const x = d3.scaleBand()
      .domain(processedData.map(d => d.label))
      .range([marginLeft, width - marginRight])
      .padding(0.2);

    // Find the absolute highest and lowest points to set the Y-axis accurately
    const yMin = Math.min(0, d3.min(processedData, d => Math.min(d.start, d.end)) || 0);
    const yMax = Math.max(0, d3.max(processedData, d => Math.max(d.start, d.end)) || 0);

    const y = d3.scaleLinear()
      .domain([yMin, yMax * 1.1]).nice() // 10% headroom
      .range([height - marginBottom, marginTop]);

    // --- AXES & GRID ---
    if (svg.select('.x-axis').empty()) {
      svg.append('g').attr('class', 'axis x-axis');
      svg.append('g').attr('class', 'axis y-axis');
    }

    // X Axis (Positioned at Y=0, not necessarily at the very bottom if there are negative numbers!)
    const yZeroPos = y(0);
    
    svg.select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0,${height - marginBottom})`) // Keep labels at the bottom edge
      .transition().duration(500)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr('font-size', '11px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('color', '#64748b')
      .call(g => g.select('.domain').remove()); // Remove baseline since we draw a custom 0-line

    // Draw a prominent Zero Baseline
    let zeroLine = svg.select('.zero-line');
    if (zeroLine.empty()) {
      zeroLine = svg.append('line').attr('class', 'zero-line');
    }
    zeroLine
      .transition().duration(500)
      .attr('x1', marginLeft)
      .attr('x2', width - marginRight)
      .attr('y1', yZeroPos)
      .attr('y2', yZeroPos)
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1.5);

    // Y Axis
    svg.select<SVGGElement>('.y-axis')
      .attr('transform', `translate(${marginLeft},0)`)
      .transition().duration(500)
      .call(d3.axisLeft(y)
        .ticks(6)
        .tickFormat(d3.format("~s")) // e.g., 125k, -45k
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

    // --- DRAWING THE CONNECTOR LINES ---
    if (showConnectorLines) {
      let connectorsGroup = svg.select<SVGGElement>('.connectors-group');
      if (connectorsGroup.empty()) {
        connectorsGroup = svg.append('g').attr('class', 'connectors-group');
      }

      // We need lines connecting the `end` of current to `start` of next
      const lineData = processedData.slice(0, -1).map((d, i) => {
        return {
          id: d.id,
          y: y(d.end),
          x1: (x(d.label) || 0) + x.bandwidth() / 2, // From middle of current
          x2: (x(processedData[i + 1].label) || 0) + x.bandwidth() / 2 // To middle of next
        };
      });

      const connectors = connectorsGroup.selectAll<SVGLineElement, any>('.connector')
        .data(lineData, d => d.id);

      connectors.exit().remove();

      connectors.enter()
        .append('line')
        .attr('class', 'connector')
        .attr('stroke', '#cbd5e1') // slate-300
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '2,2')
        .merge(connectors)
        .transition().duration(750)
        .attr('x1', d => d.x1)
        .attr('x2', d => d.x2)
        .attr('y1', d => d.y)
        .attr('y2', d => d.y);
    }

    // --- DRAWING THE BARS ---
    let barsGroup = svg.select<SVGGElement>('.bars-group');
    if (barsGroup.empty()) {
      barsGroup = svg.append('g').attr('class', 'bars-group');
    }

    const bars = barsGroup.selectAll<SVGRectElement, any>('.bar')
      .data(processedData, d => d.id);

    // EXIT
    bars.exit()
      .transition().duration(300)
      .attr('height', 0)
      .remove();

    // ENTER
    const enterBars = bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.start)) // Start exactly at the baseline of where this change begins
      .attr('height', 0)          // Zero height for the pop-out animation
      .attr('fill', d => d.color)
      .attr('rx', 2)
      .style('cursor', 'pointer');

    // ENTER ANIMATION (Staggered step-by-step)
    enterBars.transition()
      .duration(500)
      .delay((_, i) => i * 150) // Walk across the chart sequentially!
      .ease(d3.easeCubicOut)
      .attr('y', d => Math.min(y(d.start), y(d.end))) // Top edge
      .attr('height', d => Math.abs(y(d.start) - y(d.end))); // Height magnitude

    // UPDATE ANIMATION
    bars.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('x', d => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', d => Math.min(y(d.start), y(d.end)))
      .attr('height', d => Math.abs(y(d.start) - y(d.end)))
      .attr('fill', d => d.color);

    // --- DRAWING VALUE LABELS ---
    let labelsGroup = svg.select<SVGGElement>('.labels-group');
    if (labelsGroup.empty()) {
      labelsGroup = svg.append('g').attr('class', 'labels-group');
    }

    const labels = labelsGroup.selectAll<SVGTextElement, any>('.value-label')
      .data(processedData, d => d.id);

    labels.exit().remove();

    const enterLabels = labels.enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.start))
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('fill', d => d.color) // Match the text to the bar color
      .style('opacity', 0)
      .text(d => (d.displayValue > 0 && !d.isTotal ? '+' : '') + d3.format('~s')(d.displayValue));

    // Staggered label appearance to match the bars
    enterLabels.transition()
      .duration(500)
      .delay((_, i) => (i * 150) + 200) 
      .attr('y', d => {
         const yTopEdge = Math.min(y(d.start), y(d.end));
         // If it's a negative block moving down, put label below it. Otherwise above.
         return d.end < d.start ? yTopEdge + Math.abs(y(d.start) - y(d.end)) + 14 : yTopEdge - 6;
      })
      .style('opacity', 1);

    // UPDATE Labels
    labels.transition()
      .duration(750)
      .attr('x', d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', d => {
        const yTopEdge = Math.min(y(d.start), y(d.end));
        return d.end < d.start ? yTopEdge + Math.abs(y(d.start) - y(d.end)) + 14 : yTopEdge - 6;
      })
      .text(d => (d.displayValue > 0 && !d.isTotal ? '+' : '') + d3.format('~s')(d.displayValue));

    // HOVER
    enterBars.merge(bars)
      .on('mouseenter', function () {
        barsGroup.selectAll('.bar').transition().duration(200).attr('opacity', 0.4);
        d3.select(this).transition().duration(200).attr('opacity', 1).attr('filter', 'brightness(1.1)');
      })
      .on('mouseleave', function () {
        barsGroup.selectAll('.bar').transition().duration(200).attr('opacity', 1).attr('filter', 'none');
      });

  }, [data, dimensions, colorPositive, colorNegative, colorTotal, showConnectorLines, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[350px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedWaterfallChart;