import React from 'react';
import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import styles from './styles.module.scss';

export interface DialogProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @schema {"type":"boolean"} */
  open?: boolean;
  /** @translate */
  title?: string;
  /** @translate */
  description?: string;
  /** @translate */
  confirmLabel?: string;
  /** @translate */
  cancelLabel?: string;
  /** @type|function */
  onClose?: () => void;
  /** @type|function */
  onConfirm?: () => void;
}

export function Dialog({
  themeMode = 'dark',
  open = false,
  title = 'Dialog Title',
  description = 'Dialog body text.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onClose,
  onConfirm,
}: DialogProps) {
  return (
    <span data-theme={themeMode} className={styles.root}>
      <MuiDialog open={open} onClose={() => onClose?.()}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose?.()}>{cancelLabel}</Button>
          <Button variant="contained" onClick={() => onConfirm?.()}>
            {confirmLabel}
          </Button>
        </DialogActions>
      </MuiDialog>
    </span>
  );
}
export default Dialog;
