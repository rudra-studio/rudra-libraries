import React from 'react';
import styles from './styles.module.scss';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>UI Library</div>
          <ul className={styles.navLinks}>
            <li><a href="#">Components</a></li>
            <li><a href="#">Hooks</a></li>
            <li><a href="#">Docs</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>
              Build your next project <br />
              <span className={styles.gradientText}>faster than ever.</span>
            </h1>
            <p className={styles.subtitle}>
              A comprehensive set of UI components and hooks to help you build 
              modern React applications with ease and consistency.
            </p>
            <div className={styles.ctaGroup}>
              <button className={styles.primaryBtn}>Get Started</button>
              <button className={styles.secondaryBtn}>View Components</button>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.container}>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.icon}>⚡</div>
                <h3>High Performance</h3>
                <p>Optimized for speed and minimal bundle size.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.icon}>🎨</div>
                <h3>Fully Themeable</h3>
                <p>Easily customize every aspect of the library.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.icon}>📱</div>
                <h3>Responsive Design</h3>
                <p>Components work flawlessly across all screen sizes.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2024 Your UI Library. Built for developers.</p>
        </div>
      </footer>
    </div>
  );
}
