import React from 'react';
import { Accordion as MuiAccordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import styles from './styles.module.scss';

export interface AccordionProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  title?: string;
  /** @translate */
  summary?: string;
  /** @translate */
  details?: string;
  /** @schema {"type":"boolean"} */
  defaultExpanded?: boolean;
}

export function Accordion({
  themeMode = 'dark',
  title = 'Accordion Section',
  summary = 'Expand for details',
  details = 'Collapsible section content.',
  defaultExpanded = false,
}: AccordionProps) {
  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiAccordion defaultExpanded={defaultExpanded}>
        <AccordionSummary expandIcon={<span>▾</span>}>
          <div>
            <Typography fontWeight={700}>{title}</Typography>
            {summary && (
              <Typography variant="caption" color="text.secondary">
                {summary}
              </Typography>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">{details}</Typography>
        </AccordionDetails>
      </MuiAccordion>
    </div>
  );
}
export default Accordion;
