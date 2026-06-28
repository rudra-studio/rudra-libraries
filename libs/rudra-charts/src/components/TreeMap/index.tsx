import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface TreemapDataNode {
  name: string;
  value?: number; // Leaves have values
  children?: TreemapDataNode[]; // Branches have children
}

export interface AnimatedTreemapProps {
  /** The hierarchical dataset (must have a single root node) */
  data?: TreemapDataNode; /* @binding */

  /** Default palette mapped to the top-level categories */
  themeColors?: string[]; /* @complex|{"type":"array","items":{"type":"string"}} */

  // Margins
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  className?: string;
}

export const AnimatedTreemap: React.FC<AnimatedTreemapProps> = ({
  data = {
    name: 'Root',
    children: [
      {
        name: 'Marketing',
        children: [
          { name: 'Social Media', value: 250 },
          { name: 'SEO', value: 150 },
          { name: 'Events', value: 300 },
        ]
      },
      {
        name: 'Engineering',
        children: [
          { name: 'Frontend', value: 400 },
          { name: 'Backend', value: 350 },
          { name: 'DevOps', value: 200 },
          { name: 'QA', value: 100 },
        ]
      },
      {
        name: 'Sales',
        children: [
          { name: 'Enterprise', value: 500 },
          { name: 'SMB', value: 250 },
        ]
      },
      {
        name: 'HR',
        children: [
          { name: 'Recruiting', value: 120 },
          { name: 'Benefits', value: 80 },
        ]
      }
    ]
  },
  themeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
  marginTop = 10,
  marginBottom = 10,
  marginLeft = 10,
  marginRight = 10,
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
    if (!svgRef.current || dimensions.width === 0 || !data) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    const innerWidth = width - marginLeft - marginRight;
    const innerHeight = height - marginTop - marginBottom;

    // --- DATA HIERARCHY & TREEMAP GENERATION ---
    // 1. Construct the hierarchy
    const root = d3.hierarchy<TreemapDataNode>(data)
      .sum(d => d.value || 0) // Calculate sizes based on the leaves
      .sort((a, b) => (b.value || 0) - (a.value || 0)); // Largest boxes top-left

    // 2. Generate the Treemap layout
    const treemapLayout = d3.treemap<TreemapDataNode>()
      .size([innerWidth, innerHeight])
      .paddingInner(2)  // Gap between sibling leaves
      .paddingOuter(2)  // Gap between groups
      .paddingTop(24)   // Extra padding at the top for the Category Label
      .round(true);

    treemapLayout(root);

    // Extract the top-level categories (children of the root) to assign colors
    const topCategories = root.children ? root.children.map(d => d.data.name) : [];
    const colorScale = d3.scaleOrdinal<string>()
      .domain(topCategories)
      .range(themeColors);

    // Create a central group for margins
    let chartGroup = svg.select<SVGGElement>('.chart-group');
    if (chartGroup.empty()) {
      chartGroup = svg.append('g').attr('class', 'chart-group');
    }
    chartGroup.attr('transform', `translate(${marginLeft},${marginTop})`);

    // --- DRAWING THE CATEGORY HEADERS (Parents) ---
    // We filter for nodes that have a depth of 1 (immediate children of root)
    const parents = root.descendants().filter(d => d.depth === 1);
    
    let parentsGroup = chartGroup.select<SVGGElement>('.parents-group');
    if (parentsGroup.empty()) {
      parentsGroup = chartGroup.append('g').attr('class', 'parents-group');
    }

    const parentNodes = parentsGroup.selectAll<SVGGElement, d3.HierarchyRectangularNode<TreemapDataNode>>('.parent-node')
      .data(parents, d => d.data.name);

    parentNodes.exit().remove();

    const enterParents = parentNodes.enter()
      .append('g')
      .attr('class', 'parent-node')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Add Category Text
    enterParents.append('text')
      .attr('class', 'parent-label')
      .attr('x', 4)
      .attr('y', 16)
      .attr('font-size', '13px')
      .attr('font-weight', '700')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('fill', '#475569') // slate-600
      .style('opacity', 0)
      .text(d => d.data.name);

    enterParents.merge(parentNodes)
      .transition().duration(750).ease(d3.easeCubicOut)
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .select('.parent-label')
      .style('opacity', 1)
      .text(d => d.data.name);

    // --- DRAWING THE LEAVES (Children) ---
    const leaves = root.leaves();

    let leavesGroup = chartGroup.select<SVGGElement>('.leaves-group');
    if (leavesGroup.empty()) {
      leavesGroup = chartGroup.append('g').attr('class', 'leaves-group');
    }

    const leafNodes = leavesGroup.selectAll<SVGGElement, d3.HierarchyRectangularNode<TreemapDataNode>>('.leaf-node')
      .data(leaves, d => d.data.name);

    leafNodes.exit()
      .transition().duration(300)
      .style('opacity', 0)
      .remove();

    const enterLeaves = leafNodes.enter()
      .append('g')
      .attr('class', 'leaf-node')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // The Rectangles
    enterLeaves.append('rect')
      .attr('class', 'leaf-rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => {
        // Find the top-level parent to match the category color
        let current = d;
        while (current.depth > 1 && current.parent) {
          current = current.parent;
        }
        return colorScale(current.data.name);
      })
      .attr('rx', 4)
      .style('opacity', 0) // Start invisible for animation
      .style('cursor', 'pointer');

    // The Labels inside the rectangles
    enterLeaves.append('text')
      .attr('class', 'leaf-label')
      .attr('x', 6)
      .attr('y', 18)
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('fill', '#ffffff')
      .style('opacity', 0)
      // Only render text if the box is wide enough
      .text(d => (d.x1 - d.x0 > 50 && d.y1 - d.y0 > 24) ? d.data.name : '');
      
    enterLeaves.append('text')
      .attr('class', 'leaf-value')
      .attr('x', 6)
      .attr('y', 32)
      .attr('font-size', '10px')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('fill', '#f8fafc') // very light text for values
      .style('opacity', 0)
      .text(d => (d.x1 - d.x0 > 50 && d.y1 - d.y0 > 40) ? d.value : '');

    // ENTER ANIMATION
    enterLeaves.select('.leaf-rect')
      .transition().duration(600).delay((_, i) => i * 30).ease(d3.easeCubicOut)
      .style('opacity', 0.85);

    enterLeaves.selectAll('text')
      .transition().duration(600).delay((_, i) => (i * 30) + 300)
      .style('opacity', 1);

    // UPDATE ANIMATION
    const mergedLeaves = enterLeaves.merge(leafNodes);
    
    mergedLeaves.transition().duration(750).ease(d3.easeCubicOut)
      .attr('transform', d => `translate(${d.x0},${d.y0})`);
      
    mergedLeaves.select('.leaf-rect')
      .transition().duration(750).ease(d3.easeCubicOut)
      .attr('width', d => Math.max(0, d.x1 - d.x0))
      .attr('height', d => Math.max(0, d.y1 - d.y0));

    mergedLeaves.select('.leaf-label')
      .text(d => (d.x1 - d.x0 > 50 && d.y1 - d.y0 > 24) ? d.data.name : '');

    mergedLeaves.select('.leaf-value')
      .text(d => (d.x1 - d.x0 > 50 && d.y1 - d.y0 > 40) ? d.value : '');

    // HOVER INTERACTIONS
    mergedLeaves
      .on('mouseenter', function () {
        leavesGroup.selectAll('.leaf-rect').transition().duration(200).style('opacity', 0.4);
        d3.select(this).select('.leaf-rect')
          .transition().duration(200)
          .style('opacity', 1)
          .attr('filter', 'brightness(1.1)');
      })
      .on('mouseleave', function () {
        leavesGroup.selectAll('.leaf-rect')
          .transition().duration(200)
          .style('opacity', 0.85)
          .attr('filter', 'none');
      });

  }, [data, dimensions, themeColors, marginTop, marginBottom, marginLeft, marginRight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[400px] h-full relative ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedTreemap;