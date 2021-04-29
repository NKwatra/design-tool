import { Button } from "antd";
import * as React from "react";
import styles from "../styles/option.module.css";

type Props = {
  /** Whether the option is active */
  active?: boolean;
  /** function called when button is clicked */
  onClick: () => void;
  /** whether the option is disabled */
  disabled?: boolean;
  /** icon to use for option */
  icon: React.ReactNode;
};

const RichTextOption: React.FC<Props> = ({
  active,
  onClick,
  disabled = false,
  icon,
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className={
        active
          ? ` ${styles.optionButton} ${styles.active}`
          : styles.optionButton
      }
    >
      {icon}
    </Button>
  );
};

RichTextOption.defaultProps = {
  disabled: false,
};

export default RichTextOption;
