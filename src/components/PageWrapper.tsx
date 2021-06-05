import { Layout } from "antd";
import Navbar from "./Navbar";
import styles from "../styles/pagewrapper.module.css";

type Props = {
  children: React.ReactNode;
};

const { Header, Footer, Content } = Layout;

const PageWrapper: React.FC<Props> = ({ children }) => {
  return (
    <Layout>
      <Header className={styles.header}>
        <Navbar />
      </Header>
      <Content className={styles.content}>{children}</Content>
      <Footer>Footer will go here</Footer>
    </Layout>
  );
};

export default PageWrapper;
