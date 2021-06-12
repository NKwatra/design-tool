import { Card, Tag, Image } from "antd";
import moment from "moment";
import React from "react";

type Props = {
  label?: string;
  image: string;
  updatedAt: string;
};

const Version: React.FC<Props> = ({ label, image, updatedAt }) => {
  const desc = `Last opened ${moment(updatedAt).fromNow()}`;
  return (
    <Card
      cover={<Image src={image} alt="version" />}
      bordered
      hoverable
      extra={label ? <Tag color="#52c41a">{label}</Tag> : null}
      bodyStyle={{ borderTop: "solid 1px #f0f0f0" }}
    >
      <Card.Meta description={desc} />
    </Card>
  );
};

export default Version;
