import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface FunnelDataPoint {
  stage: string; // e.g., "Website Visits"
  value: number; // e.g., 15000
}

export interface AnimatedFunnelChartProps {
  /** The pipeline dataset. Should ideally be in descending order. */
  data?: FunnelDataPoint[]; /* @binding */

  /** Default palette for the funnel stages */
  themeColors?: string[]; /* @complex|{"type":"array","items":{"type":"string"}} */

  /** Show the exact number inside the funnel */
  showValues?: boolean;

  /** Show the drop-off percentage compared to the PREVIOUS stage */
  showConversionRate?: boolean;

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number; // Room for stage labels
  marginRight?: number; // Room for drop-off labels

  className?: string;
}

export const AnimatedFunnelChart: React.FC<AnimatedFunnelChartProps> = ({
  data = [
    { stage: 'Website Visitors', value: 12500 },
    { stage: 'Signed Up', value: 6000 },
    { stage: 'Onboarded', value: 3500 },
    { stage: 'Subscribed', value: 1200 },
    { stage: 'Retained (1yr)', value: 850 },
  ],
  themeColors = ['#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981'], // A cool blue-to-green gradient sequence
  showValues = true,
  showConversionRate = true,
  marginTop = 20,
  marginBottom = 20,
  marginLeft = 130, // Space for the stage text
  marginRight = 80, // Space for the conversion tags
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

    // Clear out previous renders to avoid messy re-draws on hot-reloads
    svg.selectAll('*').remove();

    // --- SCALES & MEASUREMENTS ---
    const drawWidth = width - marginLeft - marginRight;
    const centerX = marginLeft + drawWidth / 2;
    const maxValue = d3.max(data, d => d.value) || 100;

    // Y scale for the stages (gives us heights and padding)
    const y = d3.scaleBand()
      .domain(data.map(d => d.stage))
      .range([marginTop, height - marginBottom])
      .padding(0.15); // Gap between funnel layers

    // X scale for the width of the trapezoids
    const x = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, drawWidth]);

    const colorScale = d3.scaleOrdinal<string>().range(themeColors);

    // --- DATA TRANSFORMATION FOR TRAPEZOIDS ---
    // A funnel layer needs a top width and a bottom width to taper properly.
    const funnelData = data.map((d, i) => {
      const topWidth = x(d.value);
      // The bottom width tapers down to match the top of the next stage.
      // If it's the very last stage, we just taper it slightly (e.g., 80% of its top width) for aesthetics.
      const bottomWidth = i < data.length - 1 ? x(data[i + 1].value) : topWidth * 0.8;

      return {
        ...d,
        topWidth,
        bottomWidth,
        yTop: y(d.stage)!,
        yBottom: y(d.stage)! + y.bandwidth(),
        index: i,
        // Calculate conversion from previous stage
        conversion: i === 0 ? null : ((d.value / data[i - 1].value) * 100).toFixed(1)
      };
    });

    // --- DRAWING THE FUNNEL POLYGONS ---
    const funnelGroup = svg.append('g').attr('class', 'funnel-group');

    const polygons = funnelGroup.selectAll<SVGPolygonElement, any>('.funnel-layer')
      .data(funnelData, d => d.stage);

    const enterPolygons = polygons.enter()
      .append('polygon')
      .attr('class', 'funnel-layer')
      // Start collapsed at the center axis for the animation
      .attr('points', d => `
        ${centerX},${d.yTop} 
        ${centerX},${d.yTop} 
        ${centerX},${d.yBottom} 
        ${centerX},${d.yBottom}
      `)
      .attr('fill', (d, i) => colorScale(i.toString()))
      .style('cursor', 'pointer');

    // Expand outward animation
    enterPolygons.transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .delay((d, i) => i * 100) // Cascading animation from top to bottom
      .attr('points', d => `
        ${centerX - d.topWidth / 2},${d.yTop} 
        ${centerX + d.topWidth / 2},${d.yTop} 
        ${centerX + d.bottomWidth / 2},${d.yBottom} 
        ${centerX - d.bottomWidth / 2},${d.yBottom}
      `);

    // Hover interactive states
    enterPolygons
      .on('mouseenter', function () {
        d3.select(this).transition().duration(200).attr('opacity', 0.8);
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(200).attr('opacity', 1);
      });

    // --- TEXT LABELS ---
    const labelsGroup = svg.append('g').attr('class', 'labels-group');

    // 1. Stage Names (Left Side)
    labelsGroup.selectAll('.stage-label')
      .data(funnelData)
      .enter()
      .append('text')
      .attr('class', 'stage-label')
      .attr('x', marginLeft - 15)
      .attr('y', d => d.yTop + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('fill', '#475569') // slate-600
      .text(d => d.stage)
      .style('opacity', 0)
      .transition().duration(500).delay((d, i) => 400 + i * 100)
      .style('opacity', 1);

    // 2. Absolute Values (Inside the Funnel)
    if (showValues) {
      labelsGroup.selectAll('.value-label')
        .data(funnelData)
        .enter()
        .append('text')
        .attr('class', 'value-label')
        .attr('x', centerX)
        .attr('y', d => d.yTop + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'ui-sans-serif, system-ui')
        .attr('fill', '#ffffff')
        .text(d => d.value.toLocaleString())
        .style('opacity', 0)
        .transition().duration(500).delay((d, i) => 600 + i * 100)
        .style('opacity', 1);
    }

    // 3. Conversion Rates (Right Side - Floating Badges)
    if (showConversionRate) {
      const conversionGroups = labelsGroup.selectAll('.conversion-group')
        .data(funnelData.filter(d => d.index > 0)) // Skip the first stage
        .enter()
        .append('g')
        .attr('class', 'conversion-group')
        .attr('transform', d => `translate(${centerX + d.topWidth / 2 + 15}, ${d.yTop + y.bandwidth() / 2})`)
        .style('opacity', 0);

      // Background pill for the rate
      conversionGroups.append('rect')
        .attr('y', -12)
        .attr('height', 24)
        .attr('width', 54)
        .attr('rx', 12)
        .attr('fill', '#f1f5f9'); // slate-100

      // Text for the rate
      conversionGroups.append('text')
        .attr('x', 27)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'ui-sans-serif, system-ui')
        .attr('fill', '#64748b') // slate-500
        .text(d => `${d.conversion}%`);

      conversionGroups.transition().duration(500).delay((d, i) => 800 + i * 100)
        .style('opacity', 1);
    }

  }, [data, dimensions, themeColors, showValues, showConversionRate, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[350px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedFunnelChart;