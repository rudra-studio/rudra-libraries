import React, { useRef, useEffect } from 'react';
import './styles.module.scss';

const ProfessionalTitle = ({ title, subtitle, theme }) => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = titleRef.current.getBoundingClientRect();
      const offsetX = (e.clientX - rect.left) / rect.width;
      const offsetY = (e.clientY - rect.top) / rect.height;
      titleRef.current.style.transform = `rotateY(${offsetX * 20}deg) rotateX(${offsetY * 20}deg)`;
      subtitleRef.current.style.transform = `rotateY(${offsetX * 10}deg) rotateX(${offsetY * 10}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={`professional-title ${theme === 'dark' ? 'dark' : ''}`}
         onMouseMove={(e) => handleMouseMove(e)}>
      <h1 ref={titleRef} className="title">{title}</h1>
      <h2 ref={subtitleRef} className="subtitle">{subtitle}</h2>
    </div>
  );
};

export default ProfessionalTitle;