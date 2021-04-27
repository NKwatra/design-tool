import React from "react";
import { Ellipse, Group, Text } from "react-konva";
import theme from "../lib/theme";

type Props = {
  /** x position of attribute */
  x: number;
  /** y position of attribute */
  y: number;
  /** radius of ellipse in horizontal direction */
  xRadius?: number;
  /** radius of ellipse in vertical direction */
  yRadius?: number;
  /** border color of attribute */
  stroke?: string;
  /** border width of attribute */
  strokeWidth?: number;
  /** Name of the entity*/
  name?: string;
  /** color to use for name */
  nameColor?: string;
  /** width of text to use for name */
  nameWidth?: number;
  /** the type of attribute */
  type?: "multivalued" | "derived" | "normal";
};

const Attribute: React.FC<Props> = ({
  x,
  y,
  xRadius = 60,
  yRadius = 40,
  stroke = theme.itemDefaultColor,
  strokeWidth = theme.itemStrokeDefaultWidth,
  name,
  nameWidth,
  nameColor,
  type = "normal",
}) => {
  let text: string;
  if (name) {
    text = name;
  } else {
    switch (type) {
      case "multivalued":
        text = "Multivalued \n Attribute";
        break;
      case "derived":
        text = "Derived \n Attribute";
        break;
      default:
        text = "Attribute";
        break;
    }
  }
  return (
    <Group x={x} y={y} width={2 * xRadius} height={2 * yRadius} draggable>
      <Ellipse
        radiusX={xRadius}
        radiusY={yRadius}
        stroke={stroke}
        strokeWidth={strokeWidth}
        dash={type === "derived" ? [4, 4] : []}
      />
      <Text
        width={2 * xRadius}
        height={2 * yRadius}
        text={text}
        stroke={nameColor || stroke}
        strokeWidth={nameWidth || strokeWidth * 0.25}
        fontSize={theme.itemTextFontSize}
        x={-xRadius}
        align="center"
        y={-yRadius}
        verticalAlign="middle"
      />
      {type === "multivalued" ? (
        <Ellipse
          radiusX={xRadius - 5}
          radiusY={yRadius - 5}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ) : null}
    </Group>
  );
};

Attribute.defaultProps = {
  xRadius: 60,
  yRadius: 40,
  stroke: theme.itemDefaultColor,
  strokeWidth: theme.itemStrokeDefaultWidth,
  type: "normal",
};

export default Attribute;
