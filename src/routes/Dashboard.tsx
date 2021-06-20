import { FileAddOutlined, Loading3QuartersOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Spin, Typography } from "antd";
import * as React from "react";
import { useHistory } from "react-router";
import PageWrapper from "../components/PageWrapper";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import networkServices from "../lib/network";
import {
  selectUserDocuments,
  setDocuments,
  addDocument,
  deleteDocument,
} from "../redux/slice/user";
import {
  CreateDocumentSuccess,
  UpdateDocumentSuccess,
  UserDocumentsSuccess,
} from "../types/network";
import Document from "../components/Document";
import styles from "../styles/dashboard.module.css";
import CustomModal from "../components/CustomModal";

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

  const deleteDoc = async (id: string) => {
    const result = await networkServices.deleteDocument(id);
    if (result.redirect) {
      history.replace("/login");
    } else if ((result as UpdateDocumentSuccess).success) {
      dispatch(deleteDocument(id));
    }
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
  }, [documents.length, history, dispatch]);

  return (
    <PageWrapper dispatch={dispatch}>
      <>
        <Row style={{ marginTop: "4rem" }}>
          <Col offset={2} span={18}>
            {loading ? (
              <Spin
                size="large"
                indicator={<Loading3QuartersOutlined />}
                spinning
                style={{ marginLeft: "auto", marginRight: "auto" }}
              />
            ) : (
              <Space direction="vertical" size={56} style={{ width: "100%" }}>
                <Row>
                  <Col span={12}>
                    <Typography.Title level={3} style={{ color: "white" }}>
                      Welcome back, {name}!
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
                      className={styles.primaryButton}
                    >
                      Add New
                    </Button>
                  </Col>
                </Row>
                <Row gutter={[32, 32]} style={{ minHeight: "40vh" }}>
                  {documents.map((doc) => (
                    <Col key={doc.id} span={6}>
                      <Document {...doc} onDelete={deleteDoc} />
                    </Col>
                  ))}
                </Row>
              </Space>
            )}
          </Col>
        </Row>
        <CustomModal
          modalOpen={modalOpen}
          modalLoading={modalLoading}
          onOk={addNewDocument}
          onClose={closeModal}
          label="Create"
          value={title}
          setValue={setTitle}
          placeholder="Title"
        />
      </>
    </PageWrapper>
  );
};

export default Dashboard;
