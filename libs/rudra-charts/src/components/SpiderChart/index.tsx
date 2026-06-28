import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface RadarAxis {
  axis: string; // e.g., "Speed", "Strength", "Agility"
  value: number; // e.g., 85
}

export interface RadarDataPoint {
  id: string | number;
  category: string; // e.g., "Warrior", "Mage", "Rogue"
  axes: RadarAxis[];
}

export interface AnimatedRadarChartProps {
  /** The dataset containing the entities and their multi-variable stats. */
  data?: RadarDataPoint[]; /* @array */ /* @binding */

  /** Default palette for the overlapping entities */
  themeColors?: string[]; /* @complex|{"type":"array","items":{"type":"string"}} */

  /** The number of concentric grid levels to draw in the background */
  gridLevels?: number;

  /** The absolute maximum value for the scale (if omitted, calculates from data) */
  maxValue?: number;

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedRadarChart: React.FC<AnimatedRadarChartProps> = ({
  data = [
    {
      id: 1,
      category: 'Warrior',
      axes: [
        { axis: 'Strength', value: 95 },
        { axis: 'Agility', value: 30 },
        { axis: 'Intelligence', value: 20 },
        { axis: 'Charisma', value: 50 },
        { axis: 'Defense', value: 85 },
        { axis: 'Magic', value: 10 }
      ]
    },
    {
      id: 2,
      category: 'Mage',
      axes: [
        { axis: 'Strength', value: 15 },
        { axis: 'Agility', value: 40 },
        { axis: 'Intelligence', value: 100 },
        { axis: 'Charisma', value: 60 },
        { axis: 'Defense', value: 30 },
        { axis: 'Magic', value: 95 }
      ]
    },
    {
      id: 3,
      category: 'Rogue',
      axes: [
        { axis: 'Strength', value: 50 },
        { axis: 'Agility', value: 90 },
        { axis: 'Intelligence', value: 60 },
        { axis: 'Charisma', value: 85 },
        { axis: 'Defense', value: 40 },
        { axis: 'Magic', value: 25 }
      ]
    }
  ],
  themeColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
  gridLevels = 5,
  maxValue,
  marginTop = 40,
  marginBottom = 40,
  marginLeft = 40,
  marginRight = 40,
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

    // --- MATH & SCALES ---
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(
      (width - marginLeft - marginRight) / 2,
      (height - marginTop - marginBottom) / 2
    );

    // Get the names of the axes from the first data point
    const axisNames = data[0].axes.map(d => d.axis);
    const totalAxes = axisNames.length;
    
    // Angle per axis. (Full circle is 2 * Math.PI)
    const angleSlice = (Math.PI * 2) / totalAxes;

    // Find the max value to scale against
    const maxDataValue = d3.max(data, d => d3.max(d.axes, axis => axis.value)) || 100;
    const resolvedMax = maxValue !== undefined ? maxValue : maxDataValue;

    const radiusScale = d3.scaleLinear()
      .domain([0, resolvedMax])
      .range([0, radius]);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.category))
      .range(themeColors);

    // Create a master group centered in the SVG
    let g = svg.select<SVGGElement>('.radar-group');
    if (g.empty()) {
      g = svg.append('g').attr('class', 'radar-group');
    }
    g.attr('transform', `translate(${cx},${cy})`);

    // --- DRAWING THE SPIDERWEB BACKGROUND ---
    let gridGroup = g.select<SVGGElement>('.grid-group');
    if (gridGroup.empty()) {
      gridGroup = g.append('g').attr('class', 'grid-group');
    }

    // 1. Concentric Polygons
    const gridData = d3.range(1, gridLevels + 1).reverse();
    const gridPolygons = gridGroup.selectAll<SVGPolygonElement, number>('.grid-polygon')
      .data(gridData);

    gridPolygons.exit().remove();

    gridPolygons.enter()
      .append('polygon')
      .attr('class', 'grid-polygon')
      .attr('fill', '#f8fafc') // slate-50
      .attr('stroke', '#cbd5e1') // slate-300
      .attr('stroke-width', 1)
      .merge(gridPolygons)
      .transition().duration(500)
      .attr('points', level => {
        const levelFactor = radiusScale(resolvedMax * (level / gridLevels));
        return axisNames.map((_, i) => {
          // Subtract Math.PI / 2 to start the first point at 12 o'clock
          const theta = angleSlice * i - Math.PI / 2;
          return `${levelFactor * Math.cos(theta)},${levelFactor * Math.sin(theta)}`;
        }).join(" ");
      });

    // 2. Radial Axis Lines
    const gridLines = gridGroup.selectAll<SVGLineElement, string>('.grid-line')
      .data(axisNames);

    gridLines.exit().remove();

    gridLines.enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 1)
      .merge(gridLines)
      .transition().duration(500)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (_, i) => radiusScale(resolvedMax) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (_, i) => radiusScale(resolvedMax) * Math.sin(angleSlice * i - Math.PI / 2));

    // --- AXIS LABELS ---
    let labelsGroup = g.select<SVGGElement>('.labels-group');
    if (labelsGroup.empty()) {
      labelsGroup = g.append('g').attr('class', 'labels-group');
    }

    const labels = labelsGroup.selectAll<SVGTextElement, string>('.axis-label')
      .data(axisNames);

    labels.exit().remove();

    labels.enter()
      .append('text')
      .attr('class', 'axis-label')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('fill', '#475569') // slate-600
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .merge(labels)
      .transition().duration(500)
      .attr('x', (_, i) => (radiusScale(resolvedMax) + 20) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (_, i) => (radiusScale(resolvedMax) + 20) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d);

    // --- DRAWING THE RADAR BLOBS ---
    // d3.lineRadial handles the polar coordinate mapping natively for our data
    const radarLine = d3.lineRadial<RadarAxis>()
      .curve(d3.curveLinearClosed)
      .angle((_, i) => i * angleSlice)
      .radius(d => radiusScale(d.value));

    // A separate generator starting at radius 0 for the pop-out animation
    const radarLineZero = d3.lineRadial<RadarAxis>()
      .curve(d3.curveLinearClosed)
      .angle((_, i) => i * angleSlice)
      .radius(0);

    let blobsGroup = g.select<SVGGElement>('.blobs-group');
    if (blobsGroup.empty()) {
      blobsGroup = g.append('g').attr('class', 'blobs-group');
    }

    const blobs = blobsGroup.selectAll<SVGPathElement, RadarDataPoint>('.radar-blob')
      .data(data, d => d.id);

    // EXIT
    blobs.exit()
      .transition().duration(300)
      .attr('d', d => radarLineZero(d.axes))
      .attr('opacity', 0)
      .remove();

    // ENTER
    const enterBlobs = blobs.enter()
      .append('path')
      .attr('class', 'radar-blob')
      .attr('d', d => radarLineZero(d.axes)) // Start at the center (radius 0)
      .attr('fill', d => colorScale(d.category))
      .attr('fill-opacity', 0.2) // Highly transparent fill
      .attr('stroke', d => colorScale(d.category))
      .attr('stroke-width', 2.5)
      .style('cursor', 'pointer');

    // ENTER ANIMATION
    enterBlobs.transition()
      .duration(800)
      .delay((_, i) => i * 150) // Staggered outwards growth
      .ease(d3.easeBackOut.overshoot(1.1)) // Slight bounce when hitting the edge
      .attr('d', d => radarLine(d.axes));

    // UPDATE ANIMATION
    blobs.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('d', d => radarLine(d.axes))
      .attr('fill', d => colorScale(d.category))
      .attr('stroke', d => colorScale(d.category));

    // --- HOVER INTERACTIONS ---
    enterBlobs.merge(blobs)
      .on('mouseenter', function () {
        // Dim others
        blobsGroup.selectAll('.radar-blob')
          .transition().duration(200)
          .attr('fill-opacity', 0.05)
          .attr('stroke-opacity', 0.2);

        // Highlight this one heavily
        d3.select(this)
          .raise() // Bring blob to the front
          .transition().duration(200)
          .attr('fill-opacity', 0.6)
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 4);
      })
      .on('mouseleave', function () {
        // Restore all
        blobsGroup.selectAll('.radar-blob')
          .transition().duration(200)
          .attr('fill-opacity', 0.2)
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 2.5);
      });

  }, [data, dimensions, gridLevels, maxValue, themeColors, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[400px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedRadarChart;