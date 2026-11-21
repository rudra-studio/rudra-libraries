import React from 'react';
import { Stepper as MuiStepper, Step, StepLabel } from '@mui/material';
import styles from './styles.module.scss';

export interface StepperProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @type|json */
  steps?: string[];
  /** @schema {"type":"number"} */
  activeStep?: number;
}

const DEFAULT_STEPS = ['Setup', 'Configure', 'Preview'];

export function Stepper({
  themeMode = 'dark',
  steps = DEFAULT_STEPS,
  activeStep = 0,
}: StepperProps) {
  const list = Array.isArray(steps) && steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiStepper activeStep={activeStep} alternativeLabel>
        {list.map((label, i) => (
          <Step key={`${label}-${i}`}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </MuiStepper>
    </div>
  );
}
export default Stepper;
