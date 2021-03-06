import { Col, Layout, Row, Typography } from "antd";
import Navbar from "./Navbar";
import styles from "../styles/pagewrapper.module.css";
import React from "react";
import { FaGithub, FaTwitter, FaGlobe, FaLinkedin } from "react-icons/fa";
import { useAppDispatch } from "../lib/hooks";

type Props = {
  children: React.ReactNode;
  hideFooter?: boolean;
  dispatch: ReturnType<typeof useAppDispatch>;
};

const { Header, Footer, Content } = Layout;

const PageWrapper: React.FC<Props> = ({ children, hideFooter, dispatch }) => {
  return (
    <Layout>
      <Header className={styles.header}>
        <Navbar dispatch={dispatch} />
      </Header>
      <Content className={styles.content}>{children}</Content>
      {!hideFooter && (
        <Footer className={styles.footer}>
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
                <Typography.Title level={3} style={{ color: "white" }}>
                  LetsDraw
                </Typography.Title>
              </Row>
              <Row justify="center">
                <Typography.Paragraph>
                  Copyright &copy; 2021. All rights reserved.
                </Typography.Paragraph>
              </Row>
            </Col>
          </Row>
        </Footer>
      )}
    </Layout>
  );
};

export default PageWrapper;
