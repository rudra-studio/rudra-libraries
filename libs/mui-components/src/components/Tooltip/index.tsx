import React from "react";
import { Tooltip as MuiTooltip } from "@mui/material";
import styled from "@emotion/styled";
import { TooltipProps as MuiTooltipProps } from "@mui/material/Tooltip";

const StyledTooltip = styled(MuiTooltip)(({ theme }) => (
  {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: theme.typography.body1.fontSize,
    border: `1px solid ${theme.palette.primary.dark}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1),
    maxWidth: theme.spacing(40),
    minWidth: theme.spacing(15),
  }
));

interface TooltipProps extends MuiTooltipProps {
  /**
   * @translate
   */
  title: string;

  /**
   * @nodeFunction
   */
  children?: React.ReactNode;
}

export function Tooltip({ title, children }: TooltipProps) {
  return (
    <StyledTooltip
      title={title}
    >
      {children}
    </StyledTooltip>
  );
}

export default Tooltip;