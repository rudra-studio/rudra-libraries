import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export type WorkflowStatus = 'success' | 'failed' | 'running' | 'queued';

export interface WorkflowNode {
  id: string;
  label: string;
  status: WorkflowStatus;
  column: number; // The horizontal step (e.g., 0 for Build, 1 for Test)
  row: number;    // The vertical track (e.g., to handle parallel jobs)
}

export interface WorkflowLink {
  source: string; // ID of the starting node
  target: string; // ID of the ending node
}

export interface AnimatedWorkflowChartProps {
  /** The nodes (jobs/steps) in the pipeline */
  nodes?: WorkflowNode[]; /* @array */ /* @binding */

  /** The connections between the nodes */
  links?: WorkflowLink[]; /* @array */

  /** Fixed width of each node card */
  nodeWidth?: number;

  /** Fixed height of each node card */
  nodeHeight?: number;

  className?: string;
}

export const AnimatedWorkflowChart: React.FC<AnimatedWorkflowChartProps> = ({
  nodes = [
    { id: 'build', label: 'Build Project', status: 'success', column: 0, row: 1 },
    { id: 'test-unit', label: 'Unit Tests', status: 'success', column: 1, row: 0 },
    { id: 'test-e2e', label: 'E2E Tests', status: 'failed', column: 1, row: 1 },
    { id: 'lint', label: 'Linting', status: 'success', column: 1, row: 2 },
    { id: 'deploy-staging', label: 'Deploy Staging', status: 'running', column: 2, row: 1 },
    { id: 'deploy-prod', label: 'Deploy Prod', status: 'queued', column: 3, row: 1 },
  ],
  links = [
    { source: 'build', target: 'test-unit' },
    { source: 'build', target: 'test-e2e' },
    { source: 'build', target: 'lint' },
    { source: 'test-unit', target: 'deploy-staging' },
    { source: 'test-e2e', target: 'deploy-staging' },
    { source: 'lint', target: 'deploy-staging' },
    { source: 'deploy-staging', target: 'deploy-prod' },
  ],
  nodeWidth = 160,
  nodeHeight = 48,
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
    if (!svgRef.current || dimensions.width === 0 || nodes.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // --- GRID SCALES ---
    const maxColumn = d3.max(nodes, d => d.column) || 1;
    const maxRow = d3.max(nodes, d => d.row) || 1;

    // We add +1 so the scale distributes evenly across the exact number of rows/cols
    const xPad = 40; 
    const yPad = 40;

    const x = d3.scaleLinear()
      .domain([0, maxColumn])
      .range([xPad, width - xPad - nodeWidth]);

    const y = d3.scaleLinear()
      .domain([0, maxRow])
      .range([yPad, height - yPad - nodeHeight]);

    // Theme dictionaries
    const statusColors: Record<WorkflowStatus, { border: string, fill: string, text: string, icon: string }> = {
      success: { border: '#10b981', fill: '#ecfdf5', text: '#065f46', icon: '#10b981' }, // Emerald
      failed:  { border: '#ef4444', fill: '#fef2f2', text: '#991b1b', icon: '#ef4444' }, // Red
      running: { border: '#3b82f6', fill: '#eff6ff', text: '#1e40af', icon: '#3b82f6' }, // Blue
      queued:  { border: '#cbd5e1', fill: '#f8fafc', text: '#64748b', icon: '#cbd5e1' }, // Slate
    };

    // Central graphic group
    let g = svg.select<SVGGElement>('.workflow-group');
    if (g.empty()) {
      g = svg.append('g').attr('class', 'workflow-group');
    }

    // --- DRAWING LINKS (Connecting Paths) ---
    // Prepare link data with calculated start/end coordinates
    const linkData = links.map(link => {
      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);
      
      // Fallback if bad link is provided
      if (!sourceNode || !targetNode) return null; 

      return {
        id: `${link.source}-${link.target}`,
        sourceStatus: sourceNode.status,
        // Exit from the right-middle of the source node
        sourcePos: [x(sourceNode.column) + nodeWidth, y(sourceNode.row) + nodeHeight / 2],
        // Enter into the left-middle of the target node
        targetPos: [x(targetNode.column), y(targetNode.row) + nodeHeight / 2]
      };
    }).filter(Boolean) as any[];

    // D3 Generator for smooth bezier curves between two points
    const linkGenerator = d3.linkHorizontal()
      .source(d => (d as any).sourcePos)
      .target(d => (d as any).targetPos);

    let linksGroup = g.select<SVGGElement>('.links-group');
    if (linksGroup.empty()) {
      linksGroup = g.append('g').attr('class', 'links-group');
    }

    const paths = linksGroup.selectAll<SVGPathElement, any>('.pipeline-link')
      .data(linkData, d => d.id);

    paths.exit()
      .transition().duration(300).style('opacity', 0).remove();

    const enterPaths = paths.enter()
      .append('path')
      .attr('class', 'pipeline-link')
      .attr('fill', 'none')
      .attr('stroke', d => d.sourceStatus === 'failed' ? '#fee2e2' : '#e2e8f0') // slate-200 or faint red if blocked
      .attr('stroke-width', 2);

    // Initial Path Animation ("Drawing" the line)
    enterPaths
      .attr('d', linkGenerator as any)
      .each(function () {
        const length = this.getTotalLength();
        d3.select(this)
          .attr('stroke-dasharray', `${length} ${length}`)
          .attr('stroke-dashoffset', length)
          .transition()
          .duration(1000)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);
      });

    // Update Paths on resize/data change
    paths.transition().duration(750)
      .attr('d', linkGenerator as any)
      .attr('stroke-dasharray', null) // clean up from animation
      .attr('stroke-dashoffset', null);


    // --- DRAWING NODES (The Cards) ---
    let nodesGroup = g.select<SVGGElement>('.nodes-group');
    if (nodesGroup.empty()) {
      nodesGroup = g.append('g').attr('class', 'nodes-group');
    }

    const nodeGroups = nodesGroup.selectAll<SVGGElement, WorkflowNode>('.pipeline-node')
      .data(nodes, d => d.id);

    nodeGroups.exit()
      .transition().duration(300).style('opacity', 0).remove();

    const enterNodes = nodeGroups.enter()
      .append('g')
      .attr('class', 'pipeline-node')
      .attr('transform', d => `translate(${x(d.column)},${y(d.row)})`)
      .style('opacity', 0)
      .style('cursor', 'pointer');

    // The Node Card Background
    enterNodes.append('rect')
      .attr('class', 'node-bg')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', 8) // Rounded corners
      .attr('fill', d => statusColors[d.status].fill)
      .attr('stroke', d => statusColors[d.status].border)
      .attr('stroke-width', 1.5);

    // The Status Indicator (Circle)
    enterNodes.append('circle')
      .attr('class', 'node-status-dot')
      .attr('cx', 20)
      .attr('cy', nodeHeight / 2)
      .attr('r', 5)
      .attr('fill', d => statusColors[d.status].icon);

    // The Label Text
    enterNodes.append('text')
      .attr('class', 'node-label')
      .attr('x', 36)
      .attr('y', nodeHeight / 2)
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('font-family', 'ui-sans-serif, system-ui')
      .attr('fill', d => statusColors[d.status].text)
      .text(d => d.label);

    // Enter Node Animation (Pop in, cascading by column)
    enterNodes.transition()
      .duration(600)
      .delay(d => d.column * 150) // Stagger by column to mimic workflow progress
      .ease(d3.easeBackOut.overshoot(1.2))
      .style('opacity', 1);

    // Update Nodes
    const mergedNodes = enterNodes.merge(nodeGroups);
    
    mergedNodes.transition().duration(750).ease(d3.easeCubicOut)
      .attr('transform', d => `translate(${x(d.column)},${y(d.row)})`);

    mergedNodes.select('.node-bg')
      .transition().duration(500)
      .attr('fill', d => statusColors[d.status].fill)
      .attr('stroke', d => statusColors[d.status].border);

    mergedNodes.select('.node-status-dot')
      .transition().duration(500)
      .attr('fill', d => statusColors[d.status].icon);

    mergedNodes.select('.node-label')
      .transition().duration(500)
      .attr('fill', d => statusColors[d.status].text)
      .text(d => d.label);

    // --- PULSE ANIMATION FOR RUNNING JOBS ---
    // If a job is currently 'running', make its background border pulse infinitely
    mergedNodes.each(function(d) {
      const nodeBg = d3.select(this).select('.node-bg');
      if (d.status === 'running') {
        // Simple recursive pulsing loop
        const pulse = () => {
          nodeBg.transition()
            .duration(800)
            .attr('filter', 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))')
            .attr('stroke-width', 2.5)
            .transition()
            .duration(800)
            .attr('filter', 'none')
            .attr('stroke-width', 1.5)
            .on('end', pulse);
        };
        pulse();
      } else {
        // Clear any running transitions if status changed
        nodeBg.interrupt().attr('filter', 'none').attr('stroke-width', 1.5);
      }
    });

    // --- HOVER INTERACTIONS ---
    mergedNodes
      .on('mouseenter', function (event, hoveredData) {
        // Dim all other nodes
        nodesGroup.selectAll('.pipeline-node')
          .transition().duration(200)
          .style('opacity', 0.4);

        // Highlight this node
        d3.select(this)
          .transition().duration(200)
          .style('opacity', 1)
          // Minor lift effect
          .attr('transform', `translate(${x(hoveredData.column)},${y(hoveredData.row) - 2})`);

        // Highlight connected lines (Both incoming and outgoing)
        linksGroup.selectAll<SVGPathElement, any>('.pipeline-link')
          .transition().duration(200)
          .attr('stroke', d => (d.id.startsWith(hoveredData.id) || d.id.endsWith(hoveredData.id)) 
            ? '#94a3b8'  // Darker slate for connected
            : '#f1f5f9'  // Very faint slate for unconnected
          )
          .attr('stroke-width', d => (d.id.startsWith(hoveredData.id) || d.id.endsWith(hoveredData.id)) ? 3 : 1);
      })
      .on('mouseleave', function (event, hoveredData) {
        // Restore nodes
        nodesGroup.selectAll('.pipeline-node')
          .transition().duration(200)
          .style('opacity', 1)
          .attr('transform', d => `translate(${x((d as WorkflowNode).column)},${y((d as WorkflowNode).row)})`);

        // Restore lines
        linksGroup.selectAll<SVGPathElement, any>('.pipeline-link')
          .transition().duration(200)
          .attr('stroke', d => d.sourceStatus === 'failed' ? '#fee2e2' : '#e2e8f0')
          .attr('stroke-width', 2);
      });

  }, [nodes, links, dimensions, nodeWidth, nodeHeight]);

  return (
    <div ref={containerRef} className={`w-full min-h-[400px] h-full relative overflow-hidden bg-white rounded-lg border border-slate-200 ${className}`}>
      <svg ref={svgRef} width="100%" height="100%" className="block absolute inset-0 overflow-visible" />
    </div>
  );
};

export default AnimatedWorkflowChart;