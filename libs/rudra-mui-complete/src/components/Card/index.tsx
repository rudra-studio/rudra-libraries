import React from 'react';
import { Card as MuiCard, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
import styles from './styles.module.scss';

export interface CardProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @translate */
  title?: string;
  /** @translate */
  subtitle?: string;
  /** @translate */
  description?: string;
  /** @translate */
  image?: string;
  /** @translate */
  actionLabel?: string;
  /** @type|function */
  onAction?: () => void;
}

export function Card({
  themeMode = 'dark',
  title = 'Card Title',
  subtitle = '',
  description = 'Card content description.',
  image = '',
  actionLabel = 'Learn More',
  onAction,
}: CardProps) {
  return (
    <div data-theme={themeMode} className={styles.root}>
      <MuiCard variant="outlined">
        {image && <CardMedia component="img" height="160" image={image} alt={title} />}
        <CardContent>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" display="block">
              {subtitle}
            </Typography>
          )}
          <Typography variant="h6" component="h3" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        {actionLabel && (
          <CardActions>
            <Button size="small" onClick={() => onAction?.()}>
              {actionLabel}
            </Button>
          </CardActions>
        )}
      </MuiCard>
    </div>
  );
}
export default Card;
