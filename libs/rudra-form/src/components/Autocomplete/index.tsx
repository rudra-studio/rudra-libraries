import React, { useEffect, useId, useMemo, useState } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize, FormVariant } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  keywords?: string[];
}

export interface AutocompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'size' | 'value' | 'defaultValue' | 'onChange'> {
  name: string;
  label?: string;
  options: AutocompleteOption[];
  value?: string;
  defaultValue?: string;
  onChangeValue?: (value: string, option?: AutocompleteOption) => void;
  onInputValueChange?: (query: string) => void;
  allowCustomValue?: boolean;
  minQueryLength?: number;
  emptyMessage?: string;
  loading?: boolean;
  variant?: FormVariant;
  size?: ElementSize;
  error?: string;
}

export default function Autocomplete({
  name, label, options, value, defaultValue = '', onChangeValue, onInputValueChange,
  allowCustomValue = true, minQueryLength = 0, emptyMessage = 'No suggestions',
  loading = false, variant = 'default', size = 'md', error, required, disabled,
  className, placeholder, ...rest
}: AutocompleteProps) {
  const form = useRudraForm();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const contextValue = form?.values?.[name];
  const resolvedValue = value ?? (contextValue == null ? defaultValue : String(contextValue));
  const selected = options.find((option) => option.value === resolvedValue);
  const [query, setQuery] = useState(selected?.label ?? resolvedValue);
  const resolvedError = error ?? form?.errors?.[name];
  const listId = `rudra-autocomplete-${id}`;

  useEffect(() => { setQuery(selected?.label ?? resolvedValue); }, [resolvedValue, selected?.label]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (needle.length < minQueryLength) return [];
    return options.filter((option) => [option.label, option.value, ...(option.keywords ?? [])].some((item) => item.toLocaleLowerCase().includes(needle)));
  }, [minQueryLength, options, query]);

  const emit = (next: string, option?: AutocompleteOption) => {
    form?.handleChange(name, next);
    onChangeValue?.(next, option);
  };

  const choose = (option: AutocompleteOption) => {
    if (option.disabled) return;
    setQuery(option.label);
    emit(option.value, option);
    setOpen(false);
  };

  return (
    <FieldWrapper label={label} error={resolvedError} required={required} variant={variant} size={size} className={styles.wrapper}>
      <div className={[styles.root, styles[`size-${size}`], resolvedError ? styles.invalid : '', className ?? ''].filter(Boolean).join(' ')}>
        <input
          {...rest}
          
          name={name}
          value={query}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && filtered[active] ? `${listId}-${active}` : undefined}
          aria-invalid={resolvedError ? true : undefined}
          className={styles.input}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            setOpen(true);
            setActive(0);
            onInputValueChange?.(next);
            if (allowCustomValue) emit(next);
          }}
          onBlur={() => {
            window.setTimeout(() => {
              setOpen(false);
              if (!allowCustomValue) setQuery(selected?.label ?? '');
            }, 120);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setActive((current) => Math.min(current + 1, filtered.length - 1)); }
            else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((current) => Math.max(current - 1, 0)); }
            else if (event.key === 'Enter' && open && filtered[active]) { event.preventDefault(); choose(filtered[active]); }
            else if (event.key === 'Escape') { setOpen(false); }
            rest.onKeyDown?.(event);
          }}
        />
        {loading && <span className={styles.spinner} role="status" aria-label="Loading suggestions" />}
        {open && (
          <div id={listId} role="listbox" className={styles.list}>
            {!loading && filtered.map((option, index) => (
              <button
                key={option.value}
                id={`${listId}-${index}`}
                type="button"
                role="option"
                aria-selected={option.value === resolvedValue}
                disabled={option.disabled}
                className={[styles.option, index === active ? styles.active : ''].filter(Boolean).join(' ')}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
              >
                <span>{option.label}</span>
                {option.description && <small>{option.description}</small>}
              </button>
            ))}
            {!loading && filtered.length === 0 && <div className={styles.empty}>{emptyMessage}</div>}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
