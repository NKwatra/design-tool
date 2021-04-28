import React from "react";
import { Ellipse, Text } from "react-konva";
import { DispatchType } from "../lib/hooks";
import theme from "../lib/theme";
import { IItem } from "../types/item";
import Draggable from "./Draggable";

export type AttributeProps = {
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
  /**
   * A unique id for this item,
   * this will be used to update item in the redux store
   */
  id: string;
  /** Redux dispatch function to be passed down */
  dispatch: DispatchType;
  /** The currently selected item */
  selectedItem: IItem | null;
  /** Degrees by which container is rotated */
  rotation?: number;
};

const Attribute: React.FC<AttributeProps> = ({
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
  id,
  dispatch,
  selectedItem,
  rotation,
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
    <Draggable
      x={x}
      y={y}
      width={2 * xRadius}
      height={2 * yRadius}
      id={id}
      dispatch={dispatch}
      isSelected={selectedItem?.item.id === id}
      rotation={rotation}
    >
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
    </Draggable>
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
