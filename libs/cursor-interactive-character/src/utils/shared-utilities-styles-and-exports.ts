// shared-utilities-styles-and-exports.ts

import React from 'react';
import { InteractiveModelthreeD } from '../components/InteractiveModelthreeD';
import styles from './styles.module.scss';

export const useInteractiveModelthreeD = (props: any) => {
  const [model, setModel] = React.useState(null);

  React.useEffect(() => {
    const modelInstance = new InteractiveModelthreeD(props);
    setModel(modelInstance);
    return () => modelInstance.destroy();
  }, [props]);

  return model;
};

export const SharedUtilitiesStylesAndExports = () => {
  return (
    <div className={styles.container}>
      <h1>Shared Utilities, Styles, and Exports</h1>
      <p>These are shared utilities, styles, and exports for the portfolio website.</p>
      <InteractiveModelthreeD props={{}} />
    </div>
  );
};