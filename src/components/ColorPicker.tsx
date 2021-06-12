import { Tooltip } from "antd";
import React from "react";
import { ColorResult, CirclePicker } from "react-color";
import { colorsInPallete } from "../lib/constants";
import theme from "../lib/theme";
import styles from "../styles/picker.module.css";
import { PALLETE } from "../types/enums";

type Props = {
  /** Initial color for picker */
  value: string;
  /** Icon for the picker button */
  icon: React.ReactNode;
  /** function to execute when color is selected */
  onChange: (color: string) => void;
  /** whether the button is disabled */
  disabled: boolean;
  /** title of tooltip to be shown on hover */
  title: string;
  /**
   * Whether the color palette is visible/open
   */
  isOpen: boolean;
  /**
   * Function to set the open condition of this
   * color palette
   */
  setIsOpen: React.Dispatch<React.SetStateAction<PALLETE | null>>;
  /**
   * type for which this palette is being used
   */
  type: PALLETE;
};

const ColorPicker: React.FC<Props> = ({
  value,
  icon,
  onChange,
  disabled,
  title,
  isOpen,
  setIsOpen,
  type,
}) => {
  React.useEffect(() => {
    setIsOpen(null);
  }, [disabled, setIsOpen]);

  function updateColor(color: ColorResult) {
    setIsOpen(null);
    onChange(color.hex);
  }

  return (
    <Tooltip title={title} color={theme.tooltipBackgroundColor}>
      <span
        className={`${styles.iconContainer} ${disabled ? styles.disabled : ""}`}
        onClick={() => {
          if (!disabled) setIsOpen(type);
        }}
      >
        {icon}
      </span>
      <div style={{ position: "relative" }}>
        {isOpen && !disabled && (
          <span className={styles.template}>
            <CirclePicker
              onChangeComplete={updateColor}
              circleSize={16}
              circleSpacing={4}
              width={"200px"}
              colors={colorsInPallete}
              color={value}
            />
          </span>
        )}
      </div>
    </Tooltip>
  );
};

export default ColorPicker;
