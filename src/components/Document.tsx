import { DeleteOutlined } from "@ant-design/icons";
import { Image } from "antd";
import React from "react";
import { MdEdit } from "react-icons/md";
import { UserDocument } from "../types/document";
import moment from "moment";
import { useHistory } from "react-router";
import styles from "../styles/document.module.css";

const Document: React.FC<
  UserDocument & {
    onDelete: (id: string) => void;
  }
> = ({ title, lastAccessedAt, url, id, onDelete }) => {
  const history = useHistory();
  const [mask, setMask] = React.useState(false);

  const showMask = () => setMask(true);
  const hideMask = () => setMask(false);

  const openDocument = () => history.push("/diagram", { id });

  return (
    <div
      className={styles.container}
      onMouseEnter={showMask}
      onMouseLeave={hideMask}
    >
      <div className={styles.glassContainer}>
        <Image src={url} alt="Document" className={styles.image} />
        <div className={styles.description}>
          <div className={styles.descTitle}>{title}</div>
          <div className={styles.desc}>
            Opened {moment(lastAccessedAt).fromNow()}
          </div>
        </div>
      </div>
      <div className={mask ? `${styles.mask} ${styles.visible}` : styles.mask}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>
            <MdEdit color="#ffffff" size={18} onClick={openDocument} />
          </span>
          <span className={styles.icon}>
            <DeleteOutlined
              style={{ color: "#ffffff", fontSize: 18 }}
              onClick={() => onDelete(id)}
            />
          </span>
        </div>
      </div>
      <div className={styles.title} />
    </div>
  );
};

export default Document;
