import React, { useId, useState } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize, FormVariant } from '../FieldWrapper';
import styles from './styles.module.scss';

export interface TagInputProps {
  name:string; label?:string; value?:string[]; defaultValue?:string[]; onChangeValue?:(value:string[])=>void;
  placeholder?:string; separators?:string[]; maxTags?:number; allowDuplicates?:boolean; normalizeTag?:(tag:string)=>string;
  validateTag?:(tag:string)=>boolean|string; variant?:FormVariant; size?:ElementSize; required?:boolean; disabled?:boolean;
  error?:string; className?:string;
}
export default function TagInput({name,label,value,defaultValue=[],onChangeValue,placeholder='Add a tag',separators=[',','Enter'],maxTags=20,allowDuplicates=false,normalizeTag=tag=>tag.trim(),validateTag,variant='default',size='md',required,disabled,error,className}:TagInputProps){
  const form=useRudraForm();const id=useId();const [draft,setDraft]=useState('');const [localError,setLocalError]=useState('');
  const contextValue=form?.values?.[name];const tags=value??(Array.isArray(contextValue)?contextValue:defaultValue);const resolvedError=error??form?.errors?.[name]??localError;
  const emit=(next:string[])=>{form?.handleChange(name,next);onChangeValue?.(next)};
  const add=(raw:string)=>{const tag=normalizeTag(raw);if(!tag)return;const validation=validateTag?.(tag);if(validation===false||typeof validation==='string'){setLocalError(typeof validation==='string'?validation:'Invalid tag');return}if(tags.length>=maxTags){setLocalError(`Maximum ${maxTags} tags`);return}if(!allowDuplicates&&tags.some(item=>item.toLowerCase()===tag.toLowerCase())){setDraft('');return}setLocalError('');emit([...tags,tag]);setDraft('')};
  const remove=(index:number)=>emit(tags.filter((_,itemIndex)=>itemIndex!==index));
  return <FieldWrapper label={label} error={resolvedError} required={required} variant={variant} size={size} className={styles.wrapper}>
    <div className={[styles.control,styles[`size-${size}`],resolvedError?styles.invalid:'',disabled?styles.disabled:'',className??''].filter(Boolean).join(' ')} onClick={event=>(event.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
      <div className={styles.tags}>{tags.map((tag,index)=><span key={`${tag}-${index}`} className={styles.tag}><span>{tag}</span><button type="button" disabled={disabled} aria-label={`Remove ${tag}`} onClick={event=>{event.stopPropagation();remove(index)}}>×</button></span>)}</div>
      <input id={`rudra-tags-${id}`} name={name} value={draft} placeholder={tags.length?undefined:placeholder} disabled={disabled||tags.length>=maxTags} aria-invalid={resolvedError?true:undefined} className={styles.input} onChange={event=>setDraft(event.target.value)} onBlur={()=>add(draft)} onKeyDown={event=>{
        if(separators.includes(event.key)){event.preventDefault();add(draft)}
        else if(event.key==='Backspace'&&!draft&&tags.length)remove(tags.length-1);
      }} onPaste={event=>{const text=event.clipboardData.getData('text');if(text.includes(',')){event.preventDefault();text.split(',').forEach(add)}}} />
    </div>
  </FieldWrapper>
}
