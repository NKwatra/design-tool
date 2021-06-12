import { DeleteOutlined } from "@ant-design/icons";
import { Card, Image } from "antd";
import React from "react";
import { MdEdit } from "react-icons/md";
import { UserDocument } from "../types/document";
import moment from "moment";
import { useHistory } from "react-router";

const Document: React.FC<UserDocument> = ({
  title,
  lastAccessedAt,
  url,
  id,
}) => {
  const history = useHistory();

  const openDocument = () => history.push("/diagram", { id });

  return (
    <Card
      hoverable
      style={{ width: "100%", height: "36vh" }}
      cover={
        <Image
          src={url}
          alt="Document"
          style={{
            border: "solid 1px #f0f0f0",
            borderBottom: "none",
          }}
        />
      }
      actions={[
        <MdEdit size={20} color="#1890ff" onClick={openDocument} />,
        <DeleteOutlined style={{ color: "#f5222d", fontSize: "1.25rem" }} />,
      ]}
    >
      <Card.Meta
        title={title}
        description={`Opened ${moment(lastAccessedAt).fromNow()}`}
      />
    </Card>
  );
};

export default Document;
