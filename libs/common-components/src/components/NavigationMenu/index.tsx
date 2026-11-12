import React from 'react';
import './styles.module.scss';

interface NavigationMenuProps {
  items: { label: string; path: string }[];
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ items }) => {
  return (
    <nav className='navigation-menu'>
      <ul className='menu-list'>
        {items.map((item, index) => (
          <li key={index} className='menu-item'>
            <a href={item.path} className='menu-link'>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;