import { FileAddOutlined, Loading3QuartersOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Spin, Typography } from "antd";
import * as React from "react";
import { useHistory } from "react-router";
import PageWrapper from "../components/PageWrapper";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import networkServices from "../lib/network";
import {
  selectUserDocuments,
  selectUserFirstName,
  setDocuments,
} from "../redux/slice/user";
import { UserDocumentsSuccess } from "../types/network";
import Document from "../components/Document";

const Dashboard: React.FC = () => {
  const documents = useAppSelector(selectUserDocuments);
  const name = useAppSelector(selectUserFirstName);
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    async function loadDocuments() {
      if (documents.length === 0) {
        const results = await networkServices.getUserDocuments();
        if (results.redirect) {
          history.replace("/login");
        } else if ((results as UserDocumentsSuccess).documents) {
          dispatch(setDocuments((results as UserDocumentsSuccess).documents));
        }
      }
      setLoading(false);
    }
    loadDocuments();
  }, [documents, history, dispatch]);

  return (
    <PageWrapper>
      {loading ? (
        <Spin size="large" indicator={<Loading3QuartersOutlined />} />
      ) : (
        <Row style={{ marginTop: "4rem" }}>
          <Col offset={2} span={18}>
            <Space direction="vertical" size="large">
              <Row>
                <Col span={12}>
                  <Typography.Title level={3}>
                    Welcome back {name}!
                  </Typography.Title>
                </Col>
                <Col
                  span={12}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    type="primary"
                    size="large"
                    icon={<FileAddOutlined />}
                    style={{ borderRadius: 4 }}
                  >
                    Add New
                  </Button>
                </Col>
              </Row>
              <Row>
                {documents.map((doc) => (
                  <Col key={doc.id} span={5}>
                    <Document {...doc} />
                  </Col>
                ))}
              </Row>
            </Space>
          </Col>
        </Row>
      )}
    </PageWrapper>
  );
};

export default Dashboard;
