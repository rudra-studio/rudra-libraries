import React from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => (
  {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing(2),
    },
    link: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }
));

interface SocialLinksProps {
  links: Array<{ icon: React.ReactNode; url: string }>; // Mock propsStructure
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <div className={clsx(classes.container, theme.palette.mode === 'dark' && 'dark-mode')}
    >
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target='_blank'
          rel='noopener noreferrer'
          className={classes.link}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;