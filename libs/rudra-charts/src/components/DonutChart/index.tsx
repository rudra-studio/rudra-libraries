import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface PieDataPoint {
  label: string;
  value: number;
  color?: string; // Optional specific color override
}

export interface AnimatedDonutChartProps {
  /** The dataset */
  data?: PieDataPoint[]; /* @binding */
  
  /** The thickness of the donut ring */
  thickness?: number; 
  
  /** Default palette if individual colors aren't provided */
  themeColors?: string[]; /* @complex|{"type":"array","items":{"type":"string"}} */
  
  /** Text to show in the center by default (e.g., "Total Sales") */
  centerLabel?: string;
  
  className?: string;
}

export const AnimatedDonutChart: React.FC<AnimatedDonutChartProps> = ({
  data = [
    { label: 'Mobile', value: 45 },
    { label: 'Desktop', value: 35 },
    { label: 'Tablet', value: 20 },
  ],
  thickness = 60,
  themeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  centerLabel = 'Total',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });

  // 1. Responsive Observer to fit the builder canvas
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
    if (!svgRef.current || dimensions.width === 0 || data.length === 0) return;

    const { width, height } = dimensions;
    const radius = Math.min(width, height) / 2 - 20; // 20px padding
    const innerRadius = radius - thickness;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render to prevent overlapping on resize

    // Center the chart in the SVG
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // --- GENERATORS ---
    const colorScale = d3.scaleOrdinal<string>().range(themeColors);

    // The Pie generator calculates the start/end angles for each slice
    const pie = d3.pie<PieDataPoint>()
      .value(d => d.value)
      .sort(null); // Keep original order of the data array

    // The Arc generator turns those angles into SVG path strings
    const arc = d3.arc<d3.PieArcDatum<PieDataPoint>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4) // Rounded edges on the slices
      .padAngle(0.02); // Small gap between slices

    // A slightly larger arc for the hover expansion effect
    const arcHover = d3.arc<d3.PieArcDatum<PieDataPoint>>()
      .innerRadius(innerRadius)
      .outerRadius(radius + 10) // 10px larger on hover
      .cornerRadius(4)
      .padAngle(0.02);

    // --- DRAWING THE SLICES ---
    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    const paths = arcs.append('path')
      .attr('fill', (d, i) => d.data.color || colorScale(i.toString()))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', '2px')
      .style('cursor', 'pointer');

    // --- RADIAL ENTRY ANIMATION ---
    // This custom interpolator creates the spinning "unrolling" effect
    paths.transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attrTween('d', function(d) {
        // Animate from 0 angle to the final calculated angle
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(i(t))!;
        };
      });

    // --- CENTER TEXT ---
    const totalValue = d3.sum(data, d => d.value);
    
    const centerTextGroup = g.append('g').attr('text-anchor', 'middle');
    
    const valueText = centerTextGroup.append('text')
      .text(totalValue)
      .attr('y', 0)
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', '#0f172a') // slate-900
      .attr('font-family', 'ui-sans-serif, system-ui');

    const labelText = centerTextGroup.append('text')
      .text(centerLabel)
      .attr('y', 20)
      .attr('font-size', '12px')
      .attr('fill', '#64748b') // slate-500
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('text-transform', 'uppercase')
      .attr('letter-spacing', '1px');

    // --- INTERACTIVITY (HOVER EFFECTS) ---
    paths
      .on('mouseenter', function(event, d) {
        // Expand the slice
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover as any);

        // Update center text to show this specific slice's data
        valueText.text(d.data.value);
        labelText.text(d.data.label);
      })
      .on('mouseleave', function(event, d) {
        // Shrink slice back to normal
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc as any);

        // Reset center text to the global total
        valueText.text(totalValue);
        labelText.text(centerLabel);
      });

  }, [data, dimensions, thickness, themeColors, centerLabel]);

  return (
    <div ref={containerRef} className={`w-full min-h-[300px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedDonutChart;