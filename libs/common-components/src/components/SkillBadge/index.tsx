import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { css } from '@emotion/react';

const SkillBadgeContainer = styled(Box)(({ theme }) => css`
  background-color: ${theme.palette.primary.main};
  color: ${theme.palette.primary.contrastText};
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
  margin: 4px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${theme.palette.primary.dark};
  }
`);

interface SkillBadgeProps {
  skill: string;
  color?: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, color = 'primary' }) => {
  return (
    <SkillBadgeContainer color={color}>
      {skill}
    </SkillBadgeContainer>
  );
};

export default SkillBadge;