import React from 'react';
import { Card as MuiCard, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import styles from './styles.module.scss';

export interface CardProps {
  /** @translate */
  title: string;
  /** @translate */
  description: string;
  /** @color */
  backgroundColor?: string;
  /** @color */
  textColor?: string;
  /** @hidden */
  analyticsId?: string;
  /** @nodeFunction */
  actions?: () => React.ReactNode;
  /** @optional */
  media?: React.ReactNode;
  /** @optional */
  image?: string;
  /** @optional */
  alt?: string;
}

const StyledCard = styled(MuiCard)(({ theme, backgroundColor, textColor }) => ({
  backgroundColor: backgroundColor || theme.palette.background.paper,
  color: textColor || theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
}));

export function Card({
  title,
  description,
  backgroundColor,
  textColor,
  analyticsId,
  actions,
  media,
  image,
  alt,
}: CardProps) {
  return (
    <StyledCard className={styles.card} data-analytics-id={analyticsId}>
      {image && <CardMedia component='img' image={image} alt={alt} className={styles.media} />}
      <CardContent className={styles.content}>
        <Typography gutterBottom variant='h5' component='div' className={styles.title}>
          {title}
        </Typography>
        <Typography variant='body2' color='text.secondary' className={styles.description}>
          {description}
        </Typography>
      </CardContent>
      {actions && <CardActions className={styles.actions}>{actions()}</CardActions>}
      {media && <CardContent className={styles.mediaContent}>{media}</CardContent>}
    </StyledCard>
  );
}

export default Card;