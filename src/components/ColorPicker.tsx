import React from "react";
import { ColorResult, CirclePicker } from "react-color";
import { colorsInPallete } from "../lib/constants";
import styles from "../styles/picker.module.css";

type Props = {
  /** Initial color for picker */
  value: string;
  /** Icon for the picker button */
  icon: React.ReactNode;
  /** function to execute when color is selected */
  onChange: (color: string) => void;
  /** whether the button is disabled */
  disabled: boolean;
};

const ColorPicker: React.FC<Props> = ({ value, icon, onChange, disabled }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [disabled]);

  function updateColor(color: ColorResult) {
    setIsOpen(false);
    onChange(color.hex);
  }

  return (
    <div style={{ position: "relative" }}>
      <span
        className={`${styles.iconContainer} ${disabled ? styles.disabled : ""}`}
        onClick={() => {
          if (!disabled) setIsOpen(true);
        }}
      >
        {icon}
      </span>
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
  );
};

export default ColorPicker;
