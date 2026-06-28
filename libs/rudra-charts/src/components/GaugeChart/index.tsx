import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface GaugeZone {
  start: number;
  end: number;
  color: string;
}

export interface AnimatedGaugeChartProps {
  /** The current value to display */
  value?: number; /* @binding */

  /** The minimum value of the gauge */
  min?: number;

  /** The maximum value of the gauge */
  max?: number;

  /** Color-coded segments for the gauge track */
  zones?: GaugeZone[]; /* @array */

  /** Unit text displayed below the value (e.g., "mph", "kW", "Users") */
  unit?: string;

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedGaugeChart: React.FC<AnimatedGaugeChartProps> = ({
  value = 78,
  min = 0,
  max = 100,
  zones = [
    { start: 0, end: 50, color: '#10b981' },   // Green (Safe)
    { start: 50, end: 80, color: '#f59e0b' },  // Yellow (Warning)
    { start: 80, end: 100, color: '#ef4444' }  // Red (Danger)
  ],
  unit = 'Score',
  marginTop = 30,
  marginBottom = 30, // Room for the baseline labels
  marginLeft = 30,
  marginRight = 30,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // Gauge charts are typically half-circles, so height is generally width/2 + margins
  const [dimensions, setDimensions] = useState({ width: 0, height: 250 });

  // 1. Responsive Canvas Observer
  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const currentWidth = entries[0].contentRect.width;
        setDimensions({
          width: currentWidth,
          // Force a 2:1 aspect ratio roughly for the half-circle
          height: Math.max(250, (currentWidth / 2) + marginTop + marginBottom)
        });
      }
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, [marginTop, marginBottom]);

  // 2. D3 Engine
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // --- MATH & SCALES ---
    // The anchor point (center of the dial) is at the bottom-middle of the drawing area
    const cx = width / 2;
    const cy = height - marginBottom; 
    
    // Radius is constrained by either the available width or available height
    const radius = Math.min(
      (width - marginLeft - marginRight) / 2, 
      cy - marginTop
    );

    // Clamp the value so the needle doesn't break the gauge boundaries
    const clampedValue = Math.max(min, Math.min(value, max));

    // Map values to Angles (-90 degrees to +90 degrees in Radians)
    const angleScale = d3.scaleLinear()
      .domain([min, max])
      .range([-Math.PI / 2, Math.PI / 2]);

    // --- DRAWING THE ZONES (The Track) ---
    const arcGenerator = d3.arc<GaugeZone>()
      .innerRadius(radius * 0.75) // Thickness of the gauge ring
      .outerRadius(radius)
      .startAngle(d => angleScale(d.start))
      .endAngle(d => angleScale(d.end))
      .cornerRadius(2) // Smooths the edges between zones slightly
      .padAngle(0.02); // Small gap between colored zones

    let trackGroup = svg.select<SVGGElement>('.track-group');
    if (trackGroup.empty()) {
      trackGroup = svg.append('g').attr('class', 'track-group');
    }
    
    // Move the entire track group to the center point
    trackGroup.attr('transform', `translate(${cx}, ${cy})`);

    const arcs = trackGroup.selectAll<SVGPathElement, GaugeZone>('.zone')
      .data(zones, d => `${d.start}-${d.end}`);

    arcs.exit().remove();

    const enterArcs = arcs.enter()
      .append('path')
      .attr('class', 'zone')
      .attr('fill', d => d.color)
      .attr('opacity', 0) // Start invisible for animation
      .attr('d', arcGenerator);

    // Fade in the track
    enterArcs.transition()
      .duration(500)
      .delay((_, i) => i * 100)
      .attr('opacity', 0.9);

    arcs.transition()
      .duration(500)
      .attr('d', arcGenerator)
      .attr('fill', d => d.color);

    // --- TICK LABELS (Min & Max) ---
    let labelsGroup = svg.select<SVGGElement>('.labels-group');
    if (labelsGroup.empty()) {
      labelsGroup = svg.append('g').attr('class', 'labels-group');
    }
    labelsGroup.attr('transform', `translate(${cx}, ${cy})`);

    // Min Label (Bottom Left)
    let minLabel = labelsGroup.select<SVGTextElement>('.min-label');
    if (minLabel.empty()) {
      minLabel = labelsGroup.append('text').attr('class', 'min-label');
    }
    minLabel
      .attr('x', -radius + 10)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('fill', '#64748b')
      .text(min);

    // Max Label (Bottom Right)
    let maxLabel = labelsGroup.select<SVGTextElement>('.max-label');
    if (maxLabel.empty()) {
      maxLabel = labelsGroup.append('text').attr('class', 'max-label');
    }
    maxLabel
      .attr('x', radius - 10)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('fill', '#64748b')
      .text(max);

    // --- DRAWING THE NEEDLE ---
    let needleGroup = svg.select<SVGGElement>('.needle-group');
    if (needleGroup.empty()) {
      needleGroup = svg.append('g').attr('class', 'needle-group');
      
      // Base circle
      needleGroup.append('circle')
        .attr('class', 'needle-base')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 8)
        .attr('fill', '#1e293b'); // slate-800

      // Pointer path (A tapered triangle pointing UP towards 0 degrees)
      needleGroup.append('path')
        .attr('class', 'needle-pointer')
        .attr('fill', '#1e293b')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5);
    }
    
    // Position the group at the center of the arc
    needleGroup.attr('transform', `translate(${cx}, ${cy})`);

    // Update the pointer length based on current radius
    needleGroup.select('.needle-pointer')
      .attr('d', `M -4 0 L 0 ${-radius * 0.85} L 4 0 Z`);

    // Convert Radian angle to Degrees for SVG rotation
    // Note: D3 angleScale uses 0 rad as top-center. SVG rotate uses 0 deg as top-center.
    const targetAngle = (angleScale(clampedValue) * 180) / Math.PI;

    // ANIMATE THE NEEDLE (The Speedometer Effect)
    needleGroup.select('.needle-pointer')
      .transition()
      .duration(1200)
      .ease(d3.easeElasticOut.amplitude(1.2).period(0.6)) // Satisfying spring effect
      .attrTween('transform', function() {
        // Get the current rotation, default to min value angle if first render
        const currentTransform = d3.select(this).attr('transform');
        const startAngle = currentTransform 
          ? parseFloat(currentTransform.replace(/rotate\(([^)]+)\)/, '$1')) 
          : (angleScale(min) * 180) / Math.PI;
        
        const interpolator = d3.interpolateNumber(startAngle, targetAngle);
        return function(t) {
          return `rotate(${interpolator(t)})`;
        };
      });

    // --- DIGITAL READOUT (Center Text) ---
    let readoutGroup = svg.select<SVGGElement>('.readout-group');
    if (readoutGroup.empty()) {
      readoutGroup = svg.append('g').attr('class', 'readout-group');
      
      readoutGroup.append('text')
        .attr('class', 'readout-value')
        .attr('text-anchor', 'middle')
        .attr('font-weight', '700')
        .attr('font-family', 'ui-sans-serif, system-ui')
        .attr('fill', '#0f172a'); // slate-900
        
      readoutGroup.append('text')
        .attr('class', 'readout-unit')
        .attr('text-anchor', 'middle')
        .attr('font-weight', '500')
        .attr('font-family', 'ui-sans-serif, system-ui')
        .attr('fill', '#64748b'); // slate-500
    }
    
    readoutGroup.attr('transform', `translate(${cx}, ${cy - radius * 0.2})`);

    // Dynamic sizing based on radius
    readoutGroup.select('.readout-value')
      .attr('font-size', `${Math.max(24, radius * 0.25)}px`)
      .text(clampedValue.toLocaleString());

    readoutGroup.select('.readout-unit')
      .attr('y', Math.max(16, radius * 0.15))
      .attr('font-size', `${Math.max(12, radius * 0.08)}px`)
      .text(unit);

  }, [value, min, max, zones, unit, dimensions, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height={dimensions.height} className="block overflow-visible" />
    </div>
  );
};

export default AnimatedGaugeChart;