import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRudraForm } from '../RudraFormContext';
import FieldWrapper, { ElementSize } from '../FieldWrapper';
import styles from './styles.module.scss';

export type UploadStatus = 'ready' | 'uploading' | 'complete' | 'error';
export interface UploadMetadata { id: string; name: string; size: number; type: string; lastModified: number; status: UploadStatus; progress: number; result?: unknown; error?: string }
export interface FileUploadContext { signal: AbortSignal; onProgress: (progress: number) => void }
export interface FileUploadProps {
  name: string; label?: string; accept?: string; multiple?: boolean; maxFiles?: number; maxSize?: number;
  files?: File[]; defaultFiles?: File[]; onFilesChange?: (files: File[]) => void; onMetadataChange?: (metadata: UploadMetadata[]) => void;
  uploadFile?: (file: File, context: FileUploadContext) => Promise<unknown>; autoUpload?: boolean; showPreview?: boolean;
  helperText?: string; selectLabel?: string; removeLabel?: (file: File) => string; size?: ElementSize; required?: boolean; disabled?: boolean; error?: string; className?: string;
}
const makeId = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;
export default function FileUpload({ name, label, accept = 'image/*,audio/*,video/*,.pdf,.doc,.docx', multiple = true, maxFiles = 10, maxSize = 100 * 1024 * 1024, files, defaultFiles = [], onFilesChange, onMetadataChange, uploadFile, autoUpload = false, showPreview = true, helperText, selectLabel = 'Choose files', removeLabel = file => `Remove ${file.name}`, size = 'md', required, disabled, error, className }: FileUploadProps) {
  const form = useRudraForm(); const id = useId(); const inputRef = useRef<HTMLInputElement>(null); const controllers = useRef(new Map<string, AbortController>()); const [internal, setInternal] = useState<File[]>(defaultFiles); const activeFiles = files ?? internal; const [metadata, setMetadata] = useState<UploadMetadata[]>(() => defaultFiles.map(file => ({ id: makeId(file), name: file.name, size: file.size, type: file.type, lastModified: file.lastModified, status: 'ready', progress: 0 }))); const resolvedError = error ?? form?.errors?.[name];
  const previews = useMemo(() => activeFiles.map(file => ({ file, url: showPreview && (file.type.startsWith('image/') || file.type.startsWith('audio/') || file.type.startsWith('video/')) ? URL.createObjectURL(file) : '' })), [activeFiles, showPreview]);
  useEffect(() => () => previews.forEach(item => item.url && URL.revokeObjectURL(item.url)), [previews]);
  useEffect(() => () => controllers.current.forEach(controller => controller.abort()), []);
  const publish = (nextFiles: File[], nextMeta: UploadMetadata[]) => { if (files === undefined) setInternal(nextFiles); setMetadata(nextMeta); onFilesChange?.(nextFiles); onMetadataChange?.(nextMeta); form?.handleChange(name, nextMeta.map(({ id, name: fileName, size: fileSize, type, lastModified, status, progress, result, error: itemError }) => ({ id, name: fileName, size: fileSize, type, lastModified, status, progress, result, error: itemError }))) };
  const upload = async (file: File, current: File[], currentMeta: UploadMetadata[]) => { if (!uploadFile) return; const fileId = makeId(file); const controller = new AbortController(); controllers.current.set(fileId, controller); let nextMeta = currentMeta.map(item => item.id === fileId ? { ...item, status: 'uploading' as const, progress: 0, error: undefined } : item); publish(current, nextMeta); try { const result = await uploadFile(file, { signal: controller.signal, onProgress: progress => { setMetadata(previous => { const next = previous.map(item => item.id === fileId ? { ...item, progress: Math.max(0, Math.min(100, progress)) } : item); onMetadataChange?.(next); form?.handleChange(name, next); return next }) } }); setMetadata(previous => { const next = previous.map(item => item.id === fileId ? { ...item, status: 'complete' as const, progress: 100, result } : item); onMetadataChange?.(next); form?.handleChange(name, next); return next }) } catch (reason) { if (!controller.signal.aborted) setMetadata(previous => { const next = previous.map(item => item.id === fileId ? { ...item, status: 'error' as const, error: reason instanceof Error ? reason.message : 'Upload failed' } : item); onMetadataChange?.(next); form?.handleChange(name, next); return next }) } finally { controllers.current.delete(fileId) } };
  const add = (incoming: File[]) => { const valid = incoming.filter(file => file.size <= maxSize); const nextFiles = (multiple ? [...activeFiles, ...valid] : valid.slice(0, 1)).slice(0, maxFiles); const nextMeta = nextFiles.map(file => metadata.find(item => item.id === makeId(file)) ?? { id: makeId(file), name: file.name, size: file.size, type: file.type, lastModified: file.lastModified, status: 'ready' as const, progress: 0 }); publish(nextFiles, nextMeta); if (autoUpload && uploadFile) valid.slice(0, Math.max(0, maxFiles - activeFiles.length)).forEach(file => void upload(file, nextFiles, nextMeta)) };
  const remove = (file: File) => { const fileId = makeId(file); controllers.current.get(fileId)?.abort(); const nextFiles = activeFiles.filter(item => makeId(item) !== fileId); publish(nextFiles, metadata.filter(item => item.id !== fileId)) };
  return <FieldWrapper label={label} error={resolvedError} required={required} size={size} className={styles.wrapper}>
    <div className={[styles.root, styles[`size-${size}`], resolvedError ? styles.invalid : '', className ?? ''].filter(Boolean).join(' ')}>
      <input ref={inputRef} id={`rudra-upload-${id}`} name={name} type="file" accept={accept} multiple={multiple} required={required && activeFiles.length === 0} disabled={disabled || activeFiles.length >= maxFiles} className={styles.native} onChange={event => { add(Array.from(event.target.files ?? [])); event.target.value = '' }} />
      <button type="button" className={styles.select} disabled={disabled || activeFiles.length >= maxFiles} onClick={() => inputRef.current?.click()}>＋ {selectLabel}</button>
      {helperText && <p className={styles.helper}>{helperText}</p>}
      <div className={styles.list}>{previews.map(({ file, url }) => {
        const item = metadata.find(entry => entry.id === makeId(file)); return <article key={makeId(file)} className={styles.item}>
          {url && file.type.startsWith('image/') && <img src={url} alt="" className={styles.image} />}
          {url && file.type.startsWith('audio/') && <audio controls preload="metadata" src={url} className={styles.media} />}
          {url && file.type.startsWith('video/') && <video controls preload="metadata" src={url} className={styles.video} />}
          <div className={styles.info}><strong title={file.name}>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(2)} MB · {item?.status ?? 'ready'}</span>{item?.status === 'uploading' && <progress max={100} value={item.progress}>{item.progress}%</progress>}{item?.error && <small role="alert">{item.error}</small>}</div>
          {!autoUpload && uploadFile && item?.status !== 'complete' && <button type="button" disabled={disabled || item?.status === 'uploading'} onClick={() => void upload(file, activeFiles, metadata)}>Upload</button>}
          <button type="button" disabled={disabled} aria-label={removeLabel(file)} onClick={() => remove(file)}>×</button>
        </article>
      })}</div>
    </div>
  </FieldWrapper>
}
