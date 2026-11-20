import React from 'react';
import styles from './styles.module.scss';
import { Tabs as MuiTabs, Tab } from '@mui/material';
import styled from '@emotion/styled';

interface TabsProps {
  /** @select|vertical|horizontal */
  orientation?: 'vertical' | 'horizontal';

  /** @select|centered|end|start */
  variant?: 'centered' | 'end' | 'start';

  /** @hidden */
  analyticsId?: string;

  /** @nodeFunction[] */
  children: React.ReactNode[];
}

const StyledTabs = styled(MuiTabs)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export function Tabs({ orientation = 'horizontal', variant = 'start', analyticsId, children }: TabsProps) {
  return (
    <StyledTabs orientation={orientation} variant={variant} aria-label={`Tabs - ${analyticsId || 'unnamed'}`}>
      {children.map((child, index) => (
        <StyledTab key={index} label={child.props.label} value={index}>{child}</StyledTab>
      ))}
    </StyledTabs>
  );}

export default Tabs;