import React, { useState } from 'react';
import './ProfessionalTitle.module.scss';

interface ProfessionalTitleProps {
  title: string;
  description: string;
  email: string;
  socialLinks: { name: string; url: string }[];
}

const ProfessionalTitle: React.FC<ProfessionalTitleProps> = ({ title, description, email, socialLinks }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <section className={`professional-title ${theme === 'dark' ? 'dark' : ''}`}>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>Email: {email}</p>
      <ul>
        {socialLinks.map(link => (
          <li key={link.url}><a href={link.url} target='_blank' rel='noopener noreferrer'>{link.name}</a></li>
        ))}
      </ul>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </section>
  );
};

export default ProfessionalTitle;