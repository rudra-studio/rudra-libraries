import React, { useId, useRef, useState } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper from '../FieldWrapper';
import styles from './styles.module.scss';
export interface DropzoneFileMetadata{name:string;size:number;type:string;lastModified:number}
export interface DropzoneFieldProps{
  name:string;label?:string;accept?:string;multiple?:boolean;maxFiles?:number;maxSize?:number;disabled?:boolean;required?:boolean;
  value?:File[];defaultValue?:File[];onFilesChange?:(files:File[])=>void;onRejected?:(files:File[],reason:string)=>void;
  prompt?:React.ReactNode;hint?:React.ReactNode;error?:string;className?:string;
}
const metadata=(file:File):DropzoneFileMetadata=>({name:file.name,size:file.size,type:file.type,lastModified:file.lastModified});
export default function DropzoneField({name,label,accept='image/*,audio/*,video/*,.pdf',multiple=true,maxFiles=20,maxSize=250*1024*1024,disabled,required,value,defaultValue=[],onFilesChange,onRejected,prompt='Drop files here or browse',hint,error,className}:DropzoneFieldProps){
  const form=useRudraForm();const id=useId();const inputRef=useRef<HTMLInputElement>(null);const [internal,setInternal]=useState<File[]>(defaultValue);const [dragging,setDragging]=useState(false);const files=value??internal;const resolvedError=error??form?.errors?.[name];
  const acceptFile=(file:File)=>{const rules=accept.split(',').map(rule=>rule.trim()).filter(Boolean);return !rules.length||rules.some(rule=>rule.endsWith('/*')?file.type.startsWith(rule.slice(0,-1)):rule.startsWith('.')?file.name.toLowerCase().endsWith(rule.toLowerCase()):file.type===rule)};
  const add=(incoming:File[])=>{const accepted=incoming.filter(file=>file.size<=maxSize&&acceptFile(file));const rejected=incoming.filter(file=>!accepted.includes(file));if(rejected.length)onRejected?.(rejected,'File type or size is not allowed');const next=(multiple?[...files,...accepted]:accepted.slice(0,1)).slice(0,maxFiles);if(value===undefined)setInternal(next);onFilesChange?.(next);form?.handleChange(name,next.map(metadata))};
  const remove=(index:number)=>{const next=files.filter((_,itemIndex)=>itemIndex!==index);if(value===undefined)setInternal(next);onFilesChange?.(next);form?.handleChange(name,next.map(metadata))};
  return <FieldWrapper label={label} error={resolvedError} required={required} className={styles.wrapper}><div className={[styles.root,resolvedError?styles.invalid:'',className??''].filter(Boolean).join(' ')}>
    <input ref={inputRef} id={`rudra-dropzone-${id}`} name={name} type="file" accept={accept} multiple={multiple} required={required&&files.length===0} disabled={disabled} className={styles.native} onChange={event=>{add(Array.from(event.target.files??[]));event.target.value=''}}/>
    <div className={[styles.zone,dragging?styles.dragging:'',disabled?styles.disabled:''].filter(Boolean).join(' ')} role="button" tabIndex={disabled?-1:0} aria-disabled={disabled||undefined} onClick={()=>!disabled&&inputRef.current?.click()} onKeyDown={event=>{if(!disabled&&(event.key==='Enter'||event.key===' ')){event.preventDefault();inputRef.current?.click()}}} onDragEnter={event=>{event.preventDefault();if(!disabled)setDragging(true)}} onDragOver={event=>event.preventDefault()} onDragLeave={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setDragging(false)}} onDrop={event=>{event.preventDefault();setDragging(false);if(!disabled)add(Array.from(event.dataTransfer.files))}}>
      <span className={styles.mark} aria-hidden="true">⇧</span><strong>{prompt}</strong>{hint&&<div>{hint}</div>}<small>Up to {maxFiles} files · {(maxSize/1024/1024).toFixed(0)} MB each</small>
    </div>
    {files.length>0&&<ul className={styles.files}>{files.map((file,index)=><li key={`${file.name}-${file.lastModified}`}><span><b>{file.name}</b><small>{file.type||'Unknown type'} · {(file.size/1024/1024).toFixed(2)} MB</small></span><button type="button" disabled={disabled} aria-label={`Remove ${file.name}`} onClick={()=>remove(index)}>×</button></li>)}</ul>}
  </div></FieldWrapper>
}
