import React from 'react';
import { Button, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import '@emotion/react';
import '@emotion/styled';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: { label: string; path: string }[];
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ isOpen, onClose, items }) => {
  return (
    <Drawer anchor='left' open={isOpen} onClose={onClose}>
      <List>
        {items.map((item, index) => (
          <ListItem button key={index} onClick={onClose}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default NavigationMenu;