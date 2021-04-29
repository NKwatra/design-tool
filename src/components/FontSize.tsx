import { Dropdown, Menu } from "antd";
import * as React from "react";
import { RiArrowDropDownFill } from "react-icons/ri";
import styles from "../styles/fontsize.module.css";

type Props = {
  /** Font size to display */
  value: number;
  /** Whether the dropdown should be disabled */
  disabled?: boolean;
  /** function trigged when a font item is selected */
  onChange: (value: number) => void;
};

const options = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const FontSize: React.FC<Props> = ({ value, disabled = false, onChange }) => {
  const overlay = (
    <Menu onClick={({ key }) => onChange(parseInt(key as string))}>
      {options.map((option) => (
        <Menu.Item key={option.toString()}>{option}</Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown
      trigger={["click"]}
      overlay={overlay}
      placement="bottomCenter"
      disabled={disabled}
    >
      <div className={styles.container}>
        <span>{value}</span>
        <RiArrowDropDownFill size={20} />
      </div>
    </Dropdown>
  );
};

FontSize.defaultProps = {
  disabled: false,
};

export default FontSize;
