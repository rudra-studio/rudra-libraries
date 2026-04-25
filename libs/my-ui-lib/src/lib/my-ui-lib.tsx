import styles from './my-ui-lib.module.scss';

export function MyUiLib() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to MyUiLib!</h1>
    </div>
  );
}

export default MyUiLib;
