// shared-utilities-styles-and-exports.ts

import React from 'react';
import styles from './styles.module.scss';

export const NavigationBar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Rudra</div>
      <ul className={styles.navItems}>
        <li><a href='#'>Home</a></li>
        <li><a href='#'>Features</a></li>
        <li><a href='#'>About</a></li>
        <li><a href='#'>Contact</a></li>
      </ul>
    </nav>
  );
};

export const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroSection}>
      <h1>Welcome to Rudra</h1>
      <p>Your one-stop solution for building and managing libraries.</p>
    </section>
  );
};

export const FeatureCard: React.FC<{ title: string; description: string; icon: string }> = ({ title, description, icon }) => {
  return (
    <div className={styles.featureCard}>
      <img src={icon} alt={title} className={styles.icon} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Rudra. All rights reserved.</p>
    </footer>
  );
};

// styles.module.scss

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--navbar-background);
  color: var(--navbar-text);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.navItems {
  list-style: none;
  display: flex;
}

.navItems li {
  margin-left: 1rem;
}

.navItems a {
  text-decoration: none;
  color: var(--navbar-text);
}

.heroSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--hero-background);
  color: var(--hero-text);
}

.heroSection h1 {
  font-size: 2.5rem;
  margin: 0;
}

.heroSection p {
  font-size: 1.2rem;
  margin: 1rem 0;
}

.featureCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  margin: 1rem;
  background-color: var(--feature-background);
  color: var(--feature-text);
}

.featureCard h2 {
  font-size: 1.5rem;
  margin: 0;
}

.featureCard p {
  font-size: 1rem;
  margin: 0.5rem 0;
}

.featureCard img {
  width: 50px;
  height: 50px;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: var(--footer-background);
  color: var(--footer-text);
}

// theme.ts

declare module '@mui/material/styles' {
  interface Theme {
    palette: {
      navbarBackground: string;
      navbarText: string;
      heroBackground: string;
      heroText: string;
      featureBackground: string;
      featureText: string;
      footerBackground: string;
      footerText: string;
    };
  }
}

// theme-variables.ts

export const themeVariables = {
  navbarBackground: 'var(--navbar-background)',
  navbarText: 'var(--navbar-text)',
  heroBackground: 'var(--hero-background)',
  heroText: 'var(--hero-text)',
  featureBackground: 'var(--feature-background)',
  featureText: 'var(--feature-text)',
  footerBackground: 'var(--footer-background)',
  footerText: 'var(--footer-text)',
};

// index.ts

export { NavigationBar, HeroSection, FeatureCard, Footer } from './shared-utilities-styles-and-exports';
export { themeVariables } from './theme-variables';
