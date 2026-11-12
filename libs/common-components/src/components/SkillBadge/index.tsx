import "./styles.module.scss";
import React, { FC } from 'react';

interface SkillBadgeProps {
  skill: string;
  level: number;
  color?: string;
}

const SkillBadge: FC<SkillBadgeProps> = ({ skill, level, color = '#3498db' }) => (
  <div className='skill-badge' style={{ '--skill-color': color }} role='status' aria-label={`Skill level ${level} in ${skill}` }>
    {skill}
    <span className='level'>{level}</span>
  </div>
);

export default SkillBadge;