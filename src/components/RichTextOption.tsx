import { Button, Tooltip } from "antd";
import * as React from "react";
import theme from "../lib/theme";
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
  /** title of tooltip to be shown on hover */
  title: string;
};

const RichTextOption: React.FC<Props> = ({
  active,
  onClick,
  disabled = false,
  icon,
  title,
}) => {
  return (
    <Tooltip title={title} color={theme.tooltipBackgroundColor}>
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
    </Tooltip>
  );
};

RichTextOption.defaultProps = {
  disabled: false,
};

export default RichTextOption;
