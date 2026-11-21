import React from 'react';
import { Slider as MuiSlider } from '@mui/material';
import styles from './styles.module.scss';

export interface SliderProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"number"} */
  value?: number;
  /** @schema {"type":"number"} */
  min?: number;
  /** @schema {"type":"number"} */
  max?: number;
  /** @schema {"type":"number"} */
  step?: number;
  /** @schema {"type":"boolean"} */
  marks?: boolean;
  /** @schema {"type":"boolean"} */
  disabled?: boolean;
  /** @type|function */
  onChange?: (value: number) => void;
}

export function Slider({
  themeMode = 'dark',
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  marks = false,
  disabled = false,
  onChange,
}: SliderProps) {
  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiSlider
        value={value}
        min={min}
        max={max}
        step={step}
        marks={marks}
        disabled={disabled}
        valueLabelDisplay="auto"
        onChange={(_e, next) => onChange?.(Array.isArray(next) ? next[0] : next)}
      />
    </div>
  );
}
export default Slider;
