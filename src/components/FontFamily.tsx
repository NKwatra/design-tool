import { Dropdown, Menu } from "antd";
import * as React from "react";
import { RiArrowDropDownFill } from "react-icons/ri";
import { availableFonts } from "../lib/constants";
import styles from "../styles/fontfamily.module.css";

type Props = {
  /** Font Family to display */
  value: string;
  /** Whether the dropdown should be disabled */
  disabled?: boolean;
  /** function trigged when a font item is selected */
  onChange: (value: string) => void;
};

const FontFamily: React.FC<Props> = ({ value, disabled = false, onChange }) => {
  const overlay = (
    <Menu
      onClick={({ key }) => onChange(key as string)}
      style={{ background: "white" }}
    >
      {availableFonts.map((option) => (
        <Menu.Item key={option}>{option}</Menu.Item>
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
      <div className={`${styles.container} ${disabled ? styles.disabled : ""}`}>
        <span>{value}</span>
        <RiArrowDropDownFill size={20} />
      </div>
    </Dropdown>
  );
};

FontFamily.defaultProps = {
  disabled: false,
};

export default FontFamily;
