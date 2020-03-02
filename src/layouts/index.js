import styles from './index.css';
import { ConfigProvider, Layout, } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

function BasicLayout(props) {
  return (
    <ConfigProvider locale={zh_CN}>
      <Layout className={styles.layout}>
        <Layout.Content className={styles.content}>
          {props.children}
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}

export default BasicLayout;
