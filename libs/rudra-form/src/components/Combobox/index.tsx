import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize, FormVariant } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface ComboboxOption { value: string; label: string; group?: string; disabled?: boolean; }
export interface ComboboxProps {
  name: string; label?: string; options: ComboboxOption[]; value?: string; defaultValue?: string;
  onChangeValue?: (value: string, option: ComboboxOption) => void; placeholder?: string;
  searchable?: boolean; clearable?: boolean; emptyMessage?: string; variant?: FormVariant;
  size?: ElementSize; required?: boolean; disabled?: boolean; error?: string; className?: string;
}

export default function Combobox({
  name,label,options,value,defaultValue='',onChangeValue,placeholder='Select an option',
  searchable=true,clearable=false,emptyMessage='No options',variant='default',size='md',
  required,disabled,error,className
}:ComboboxProps){
  const form=useRudraForm(); const id=useId(); const rootRef=useRef<HTMLDivElement>(null);
  const [open,setOpen]=useState(false); const [query,setQuery]=useState(''); const [active,setActive]=useState(0);
  const contextValue=form?.values?.[name]; const resolvedValue=value ?? (contextValue==null?defaultValue:String(contextValue));
  const selected=options.find(option=>option.value===resolvedValue); const resolvedError=error ?? form?.errors?.[name];
  const listId=`rudra-combobox-${id}`;
  const filtered=useMemo(()=>{const needle=query.trim().toLowerCase();return options.filter(option=>!needle||option.label.toLowerCase().includes(needle));},[options,query]);
  useEffect(()=>{const close=(event:MouseEvent)=>{if(!rootRef.current?.contains(event.target as Node))setOpen(false)};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close)},[]);
  const choose=(option:ComboboxOption)=>{if(option.disabled)return;form?.handleChange(name,option.value);onChangeValue?.(option.value,option);setOpen(false);setQuery('')};
  const clear=()=>{form?.handleChange(name,'');setQuery('');setOpen(false)};
  return <FieldWrapper label={label} error={resolvedError} required={required} variant={variant} size={size} className={styles.wrapper}>
    <div ref={rootRef} className={[styles.root,styles[`size-${size}`],resolvedError?styles.invalid:'',disabled?styles.disabled:'',className??''].filter(Boolean).join(' ')}>
      <button type="button" className={styles.trigger} disabled={disabled} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} onClick={()=>setOpen(current=>!current)} onKeyDown={event=>{
        if(event.key==='ArrowDown'){event.preventDefault();setOpen(true);setActive(current=>Math.min(current+1,filtered.length-1))}
        else if(event.key==='ArrowUp'){event.preventDefault();setActive(current=>Math.max(current-1,0))}
        else if(event.key==='Enter'&&open&&filtered[active]){event.preventDefault();choose(filtered[active])}
        else if(event.key==='Escape')setOpen(false);
      }}><span className={selected?styles.value:styles.placeholder}>{selected?.label??placeholder}</span><span aria-hidden="true" className={styles.chevron}>⌄</span></button>
      {clearable&&selected&&<button type="button" className={styles.clear} aria-label="Clear selection" disabled={disabled} onClick={clear}>×</button>}
      {open&&<div className={styles.popover}>
        {searchable&&<input autoFocus className={styles.search} value={query} placeholder="Search options" aria-label="Search options" onChange={event=>{setQuery(event.target.value);setActive(0)}} />}
        <div id={listId} role="listbox" className={styles.list}>
          {filtered.map((option,index)=><button key={option.value} type="button" role="option" aria-selected={option.value===resolvedValue} disabled={option.disabled} className={[styles.option,index===active?styles.active:''].filter(Boolean).join(' ')} onMouseEnter={()=>setActive(index)} onClick={()=>choose(option)}>{option.group&&<small>{option.group}</small>}<span>{option.label}</span>{option.value===resolvedValue&&<b aria-hidden="true">✓</b>}</button>)}
          {filtered.length===0&&<div className={styles.empty}>{emptyMessage}</div>}
        </div>
      </div>}
    </div>
  </FieldWrapper>
}
