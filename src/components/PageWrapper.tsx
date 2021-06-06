import { Col, Layout, Row, Typography } from "antd";
import Navbar from "./Navbar";
import styles from "../styles/pagewrapper.module.css";
import React from "react";
import { FaGithub, FaTwitter, FaGlobe, FaLinkedin } from "react-icons/fa";

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
      <Footer style={{ marginTop: "8rem" }}>
        <Row>
          <Col span={16} offset={4}>
            <Row>
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <FaGithub size={32} style={{ cursor: "pointer" }} />
              </Col>
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <FaTwitter size={32} style={{ cursor: "pointer" }} />
              </Col>
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <FaGlobe size={32} style={{ cursor: "pointer" }} />
              </Col>
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <FaLinkedin size={32} style={{ cursor: "pointer" }} />
              </Col>
            </Row>
            <Row style={{ marginTop: "3rem" }} justify="center">
              <Typography.Title level={3}>LetsDraw</Typography.Title>
            </Row>
            <Row justify="center">
              <Typography.Paragraph>
                Copyright &copy; 2021. All rights reserved.
              </Typography.Paragraph>
            </Row>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default PageWrapper;
