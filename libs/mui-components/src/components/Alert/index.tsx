import React from "react";
import { Alert as MuiAlert, AlertProps as MuiAlertProps } from "@mui/material";
import styles from "./styles.module.scss";

export interface AlertProps extends MuiAlertProps {
  /** @translate */
  message: string;
  /** @select|info|success|warning|error */
  severity: "info" | "success" | "warning" | "error";
}

export default function Alert({ message, severity, ...props }: AlertProps) {
  return <MuiAlert severity={severity} className={styles.alert} {...props}>{message}</MuiAlert>;
}