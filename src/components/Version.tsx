import { Card, Tag, Image, Popconfirm } from "antd";
import moment from "moment";
import React from "react";

type Props = {
  label?: string;
  image: string;
  updatedAt: string;
  onClick: (id: string) => void;
  id: string;
};

const Version: React.FC<Props> = ({ label, image, updatedAt, onClick, id }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const desc = `Updated ${moment(updatedAt).fromNow()}`;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onClick(id);
    setLoading(false);
    setOpen(false);
  };

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
          <div onMouseLeave={handleClose}>
            <Popconfirm
              title={`All uncomitted changes would be deleted.
            Do you wish to continue?`}
              visible={open}
              onConfirm={handleConfirm}
              okButtonProps={{ loading }}
              onCancel={handleClose}
              cancelText="No"
              okText="Yes"
            >
              <Tag
                color="#52c41a"
                style={{ fontWeight: 600, borderRadius: 4 }}
                onClick={handleOpen}
              >
                {label}
              </Tag>
            </Popconfirm>
          </div>
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
