import { CloseOutlined } from "@ant-design/icons";
import { Modal, Input, Button } from "antd";
import styles from "../styles/customModal.module.css";

type Props = {
  modalOpen: boolean;
  modalLoading: boolean;
  onOk: () => void;
  onClose: () => void;
  label: string;
  /**
   * Value of input within the modal
   */
  value: string;
  /**
   * function triggered when value is changed
   */
  setValue: (value: string) => void;
  /**
   * placeholder for input of modal
   */
  placeholder: string;
};

const CustomModal: React.FC<Props> = ({
  modalLoading,
  modalOpen,
  onClose,
  onOk,
  label,
  value,
  setValue,
  placeholder,
}) => {
  return (
    <Modal
      visible={modalOpen}
      confirmLoading={modalLoading}
      onOk={onOk}
      centered
      closable
      width={660}
      bodyStyle={{
        background:
          "linear-gradient(94.8deg, #CD5C5C -0.42%, #FF7F50 65.37%, #F08080 116.39%)",
        boxShadow: "5px 5px 4px rgba(0, 0, 0, 0.73)",
        borderRadius: 28,
        padding: 3,
      }}
      footer={null}
      closeIcon={<CloseOutlined style={{ color: "white" }} onClick={onClose} />}
    >
      <div className={styles.modalInner}>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          bordered={false}
          className={styles.modalInput}
        />
        <div className={styles.createButton}>
          <Button
            onClick={onOk}
            type="primary"
            className={styles.primaryButton}
            disabled={value === ""}
          >
            {label}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
