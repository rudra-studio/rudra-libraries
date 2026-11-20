import React from "react";
import { Dialog as MuiDialog, DialogProps as MuiDialogProps, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import styles from "./styles.module.scss";

export interface DialogProps extends MuiDialogProps {
  /** @translate */
  title?: string;
  /** @optional */
  onClose?: (event: React.MouseEvent<HTMLElement>) => void;
  /** @translate */
  primaryAction?: string;
  /** @translate */
  secondaryAction?: string;
}

export function Dialog({ title, onClose, primaryAction, secondaryAction, children, ...rest }: DialogProps) {
  return (
    <MuiDialog {...rest} className={styles.dialog} onClose={onClose}>
      <div className={styles.header}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <IconButton onClick={onClose} className={styles.closeButton}>
          <Close className={styles.closeIcon} />
        </IconButton>
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.actions}>
        {secondaryAction && (
          <Button variant="text" onClick={() => console.log(secondaryAction)} className={styles.secondaryButton}>
            {secondaryAction}
          </Button>
        )}
        {primaryAction && (
          <Button variant="contained" onClick={() => console.log(primaryAction)} className={styles.primaryButton}>
            {primaryAction}
          </Button>
        )}
      </div>
    </MuiDialog>
  );
}

export default Dialog;