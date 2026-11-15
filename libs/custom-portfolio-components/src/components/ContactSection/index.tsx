import React, { useRef, useEffect } from 'react';
import './styles.module.scss';

interface ContactSectionProps {
  title: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: { platform: string; url: string }[];
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  title,
  email,
  phone,
  address,
  socialLinks,
  onEmailChange,
  onPhoneChange,
  onAddressChange,
}) => {
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = contactRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        contactRef.current?.style.setProperty('--contact-eye-x', `${x * 2 - 1}px`);
        contactRef.current?.style.setProperty('--contact-eye-y', `${y * 2 - 1}px`);
        contactRef.current?.style.setProperty('--contact-head-x', `${x * 2 - 1}px`);
        contactRef.current?.style.setProperty('--contact-head-y', `${y * 2 - 1}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="contact-section" ref={contactRef}>
      <h2 className="title">{title}</h2>
      <div className="contact-form">
        <div className="contact-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
        <div className="contact-field">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
          />
        </div>
        <div className="contact-field">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
          />
        </div>
      </div>
      <div className="social-links">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.platform}
          </a>
        ))}
      </div>
      <div className="contact-3d" style={{ '--contact-eye-x': 0, '--contact-eye-y': 0, '--contact-head-x': 0, '--contact-head-y': 0 }}>
        <div className="contact-3d-eye" style={{ transform: 'translateX(var(--contact-eye-x)) translateY(var(--contact-eye-y))' }}></div>
        <div className="contact-3d-head" style={{ transform: 'translateX(var(--contact-head-x)) translateY(var(--contact-head-y))' }}></div>
      </div>
    </div>
  );
};

export default ContactSection;