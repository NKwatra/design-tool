import { FileAddOutlined, Loading3QuartersOutlined } from "@ant-design/icons";
import { Button, Col, Input, Modal, Row, Space, Spin, Typography } from "antd";
import * as React from "react";
import { useHistory } from "react-router";
import PageWrapper from "../components/PageWrapper";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import networkServices from "../lib/network";
import {
  selectUserDocuments,
  setDocuments,
  addDocument,
} from "../redux/slice/user";
import { CreateDocumentSuccess, UserDocumentsSuccess } from "../types/network";
import Document from "../components/Document";

const Dashboard: React.FC = () => {
  const documents = useAppSelector(selectUserDocuments);
  const name = localStorage.getItem("name");
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalLoading, setModalLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const history = useHistory();
  const dispatch = useAppDispatch();

  const closeModal = () => setModalOpen(false);
  const addNewDocument = async () => {
    setModalLoading(true);
    const result = await networkServices.createNewDocument(title);
    if (result.redirect) {
      history.replace("/login");
    } else if ((result as CreateDocumentSuccess).newDocument) {
      dispatch(addDocument((result as CreateDocumentSuccess).newDocument));
      setTitle("");
    }
    setModalLoading(false);
    setModalOpen(false);
  };

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
      <>
        <Row style={{ marginTop: "4rem" }}>
          <Col offset={2} span={18}>
            {loading ? (
              <Spin
                size="large"
                indicator={<Loading3QuartersOutlined />}
                style={{ marginLeft: "auto", marginRight: "auto" }}
              />
            ) : (
              <Space direction="vertical" size={56} style={{ width: "100%" }}>
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
                      onClick={() => setModalOpen(true)}
                    >
                      Add New
                    </Button>
                  </Col>
                </Row>
                <Row gutter={[32, 32]} style={{ minHeight: "40vh" }}>
                  {documents.map((doc) => (
                    <Col key={doc.id} span={6}>
                      <Document {...doc} />
                    </Col>
                  ))}
                </Row>
              </Space>
            )}
          </Col>
        </Row>
        <Modal
          visible={modalOpen}
          confirmLoading={modalLoading}
          onCancel={closeModal}
          onOk={addNewDocument}
          okText="Create"
          centered
          okButtonProps={{
            disabled: title === "",
          }}
        >
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginTop: 32, marginBottom: 16 }}
          />
        </Modal>
      </>
    </PageWrapper>
  );
};

export default Dashboard;
