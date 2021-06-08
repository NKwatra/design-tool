import { Card, Tag } from "antd";
import moment from "moment";
import React from "react";

type Props = {
  label?: string;
  image: string;
  updatedAt: string;
};

const Version: React.FC<Props> = ({ label, image, updatedAt }) => {
  const desc = `Last accessed ${moment(updatedAt).fromNow()}`;
  return (
    <Card
      cover={<img src={image} alt="version" />}
      bordered
      hoverable
      extra={label ? <Tag color="#52c41a">{label}</Tag> : null}
    >
      <Card.Meta description={desc} />
    </Card>
  );
};

export default Version;
