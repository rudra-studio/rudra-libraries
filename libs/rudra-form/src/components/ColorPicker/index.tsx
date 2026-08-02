import React, { useId } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize, FormVariant } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface ColorPickerProps {
  name: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onChangeValue?: (value: string) => void;
  presets?: string[];
  showTextInput?: boolean;
  variant?: FormVariant;
  size?: ElementSize;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export default function ColorPicker({
  name,
  label,
  value,
  defaultValue = '#4f46e5',
  onChangeValue,
  presets = [],
  showTextInput = true,
  variant = 'default',
  size = 'md',
  required,
  disabled,
  error,
  className,
}: ColorPickerProps) {
  const form = useRudraForm();
  const generatedId = useId();
  const contextValue = form?.values?.[name];
  const resolvedValue = value ?? (contextValue == null ? defaultValue : String(contextValue));
  const safeValue = HEX_COLOR.test(resolvedValue) ? resolvedValue : defaultValue;
  const resolvedError = error ?? form?.errors?.[name];
  const controlId = `rudra-color-${generatedId}`;

  const emit = (next: string) => {
    form?.handleChange(name, next);
    onChangeValue?.(next);
  };

  return (
    <FieldWrapper label={label} error={resolvedError} required={required} variant={variant} size={size} className={styles.wrapper}>
      <div className={[styles.stack, styles[`size-${size}`], className ?? ''].filter(Boolean).join(' ')}>
        <div className={[styles.control, resolvedError ? styles.invalid : '', disabled ? styles.disabled : ''].filter(Boolean).join(' ')}>
          <label className={styles.swatch} style={{ '--rudra-color-value': safeValue } as React.CSSProperties}>
            <span className={styles.srOnly}>Choose color</span>
            <input
              id={controlId}
              name={name}
              type="color"
              value={safeValue}
              required={required}
              disabled={disabled}
              className={styles.native}
              onChange={(event) => emit(event.target.value)}
            />
          </label>
          {showTextInput && (
            <input
              type="text"
              value={resolvedValue}
              disabled={disabled}
              aria-label="Color hex value"
              aria-invalid={!HEX_COLOR.test(resolvedValue) || resolvedError ? true : undefined}
              spellCheck={false}
              className={styles.text}
              onChange={(event) => {
                const next = event.target.value.startsWith('#') ? event.target.value : `#${event.target.value}`;
                emit(next.slice(0, 7));
              }}
              onBlur={() => {
                if (!HEX_COLOR.test(resolvedValue)) emit(safeValue);
              }}
            />
          )}
          <span className={styles.preview} style={{ backgroundColor: safeValue }} aria-hidden="true" />
        </div>
        {presets.length > 0 && (
          <div className={styles.presets} aria-label="Preset colors">
            {presets.filter((preset) => HEX_COLOR.test(preset)).map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={disabled}
                aria-label={`Use color ${preset}`}
                aria-pressed={safeValue.toLowerCase() === preset.toLowerCase()}
                className={styles.preset}
                style={{ backgroundColor: preset }}
                onClick={() => emit(preset)}
              />
            ))}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
