import styles from './test-library.module.scss';

export function TestLibrary() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TestLibrary!</h1>
    </div>
  );
}

export default TestLibrary;
