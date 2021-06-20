import { Image, Popconfirm } from "antd";
import moment from "moment";
import React from "react";
import styles from "../styles/version.module.css";

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
    <div className={styles.container}>
      <div className={styles.main}>
        <Image src={image} alt="version" className={styles.image} />
        <div className={styles.description}>{desc}</div>
      </div>
      <div
        className={styles.tint}
        onMouseLeave={handleClose}
        onClick={handleOpen}
      >
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
          {label}
        </Popconfirm>
      </div>
    </div>
  );
};

export default Version;
