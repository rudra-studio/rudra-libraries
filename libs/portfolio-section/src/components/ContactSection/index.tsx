import React from 'react';
import styles from './ContactSection.module.scss';
import { useTheme } from 'antd';

interface ContactSectionProps {
  professionalTitle?: string;
  biography?: string;
  contactEmail?: string;
  socialLinks?: { platform: string; url: string }[];
}

const ContactSection: React.FC<ContactSectionProps> = ({
  professionalTitle = 'Software Engineer',
  biography = 'A passionate software engineer with a decade of experience in developing scalable and efficient applications.',
  contactEmail = 'person@example.com',
  socialLinks = [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/example' },
    { platform: 'GitHub', url: 'https://github.com/example' },
    { platform: 'Twitter', url: 'https://twitter.com/example' },
  ],
}) => {
  const { token } = useTheme();

  return (
    <section className={styles.contactSection} data-theme={token.colorPrimary === '#1890ff' ? 'dark' : 'light'}>
      <div className={styles.container}>
        <h1 className={styles.professionalTitle}>{professionalTitle}</h1>
        <p className={styles.biography}>{biography}</p>
        <h2 className={styles.contactHeading}>Get in touch</h2>
        <p className={styles.contactEmail}>{contactEmail}</p>
        <h2 className={styles.socialHeading}>Follow me on</h2>
        <ul className={styles.socialList}>
          {socialLinks.map((link, index) => (
            <li key={index} className={styles.socialItem}>
              <a href={link.url} target='_blank' rel='noopener noreferrer'>{link.platform}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ContactSection;