import { Dropdown, Button, Menu } from "antd";
import { FaFileDownload } from "react-icons/fa";
import styles from "../styles/menu.module.css";

type Props = {
  /**
   * Whether the image is being downloaded
   */
  loading: boolean;
  /**
   * Function to start download of image
   */
  onDownload: (format: "png" | "jpeg" | "pdf") => void;
};

const Download: React.FC<Props> = ({ loading, onDownload }) => {
  const menu = (
    <Menu>
      <Menu.Item onClick={() => onDownload("png")} className={styles.menuItem}>
        PNG
      </Menu.Item>
      <Menu.Item onClick={() => onDownload("pdf")} className={styles.menuItem}>
        PDF
      </Menu.Item>
      <Menu.Item onClick={() => onDownload("jpeg")} className={styles.menuItem}>
        JPEG
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button
        type="primary"
        icon={<FaFileDownload style={{ color: "white", marginRight: "8px" }} />}
        style={{
          marginRight: "16px",
          display: "flex",
          alignItems: "center",
          background: `linear-gradient(
            92.51deg,
            #cd5c5c 9.95%,
            #ff7f50 66.6%,
            #f08080 127.08%
          )`,
          border: "none",
          padding: "8px 32px",
          fontSize: "22px",
          height: "auto",
        }}
        loading={loading}
      >
        Download
      </Button>
    </Dropdown>
  );
};

export default Download;
