import { Card, Tag, Image } from "antd";
import moment from "moment";
import React from "react";

type Props = {
  label?: string;
  image: string;
  updatedAt: string;
};

const Version: React.FC<Props> = ({ label, image, updatedAt }) => {
  const desc = `Updated ${moment(updatedAt).fromNow()}`;
  return (
    <Card
      cover={
        <Image
          src={image}
          alt="version"
          style={{ border: "solid 1px #f0f0f0", borderBottom: "none" }}
        />
      }
      hoverable
      extra={
        label ? (
          <Tag color="#52c41a" style={{ fontWeight: 600, borderRadius: 4 }}>
            {label}
          </Tag>
        ) : null
      }
      bodyStyle={{ borderTop: "solid 1px #f0f0f0" }}
      style={{ marginTop: "16px", marginBottom: "16px" }}
    >
      <Card.Meta description={desc} />
    </Card>
  );
};

export default Version;
