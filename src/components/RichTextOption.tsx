import { Button } from "antd";
import * as React from "react";
import type { IconType } from "react-icons";
import styles from "../styles/option.module.css";

type Props = {
  /** Whether the option is active */
  active?: boolean;
  /** function called when button is clicked */
  onClick: () => void;
  /** whether the option is disabled */
  disabled?: boolean;
  /** icon to use for option */
  Icon: IconType;
};

const RichTextOption: React.FC<Props> = ({
  active,
  onClick,
  disabled = false,
  Icon,
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
      <Icon color={active ? "#ffffff" : "#000000"} />
    </Button>
  );
};

RichTextOption.defaultProps = {
  disabled: false,
};

export default RichTextOption;
