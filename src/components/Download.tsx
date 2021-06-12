import { Dropdown, Button, Menu } from "antd";
import { FaFileDownload } from "react-icons/fa";

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
      <Menu.Item onClick={() => onDownload("png")}>PNG</Menu.Item>
      <Menu.Item onClick={() => onDownload("pdf")}>PDF</Menu.Item>
      <Menu.Item onClick={() => onDownload("jpeg")}>JPEG</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button
        type="primary"
        icon={<FaFileDownload style={{ color: "white", marginRight: "8px" }} />}
        style={{
          marginRight: "16px",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
        }}
        loading={loading}
      >
        Download
      </Button>
    </Dropdown>
  );
};

export default Download;
