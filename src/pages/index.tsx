import styles from './index.less';
// @ts-ignore
import Zym from '@/pages/Zym.tsx';

export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <Zym />
    </div>
  );
}
