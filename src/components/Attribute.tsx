import type { KonvaEventObject } from "konva/types/Node";
import React from "react";
import { Ellipse, Text } from "react-konva";
import { DispatchType } from "../lib/hooks";
import theme from "../lib/theme";
import { updateItem } from "../redux/slice/diagram";
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
  /** Font size of text within entity*/
  fontSize?: number;
  /** Whether the text needs to be made bold */
  bold?: boolean;
  /** Whether the text needs to be made italic */
  italic?: boolean;
  /** Whether the text needs to be made underlined */
  underlined?: boolean;
  /** Font family of text */
  fontFamily?: string;
  /** handler for double click on text */
  handleDoubleClick: (
    e: KonvaEventObject<MouseEvent>,
    id?: string,
    text?: string
  ) => void;
  /** Whether text within it be visible */
  textVisible?: boolean;
  /** Background color of shape */
  fillColor?: string;
  /**
   * Function to send patch on object drag
   */
  onDrag: (id: string, updates: Partial<IItem["item"]>) => void;
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
  fontSize = theme.itemTextFontSize,
  bold,
  italic,
  underlined,
  fontFamily = "Arial",
  handleDoubleClick,
  textVisible = true,
  fillColor = "transparent",
  onDrag,
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
  let fontStyle = "";
  if (bold) {
    fontStyle += "bold";
  }
  if (italic) {
    fontStyle += " italic";
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
      type="attribute"
      onDrag={onDrag}
    >
      <Ellipse
        radiusX={xRadius}
        radiusY={yRadius}
        stroke={stroke}
        strokeWidth={strokeWidth}
        dash={type === "derived" ? [4, 4] : []}
        fill={fillColor}
      />
      {textVisible && (
        <Text
          width={2 * xRadius}
          height={2 * yRadius}
          text={text}
          fill={nameColor || stroke}
          strokeWidth={
            nameWidth || !bold ? strokeWidth * 0.25 : strokeWidth * 0.75
          }
          fontSize={fontSize}
          x={-xRadius}
          align="center"
          y={-yRadius}
          verticalAlign="middle"
          textDecoration={underlined ? "underline" : undefined}
          fontStyle={fontStyle !== "" ? fontStyle : undefined}
          fontFamily={fontFamily}
          onDblClick={(e) => {
            e.cancelBubble = true;
            handleDoubleClick(e, id, name);
            dispatch(
              updateItem({
                id,
                updates: {
                  textVisible: false,
                },
              })
            );
          }}
        />
      )}
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
  fontSize: theme.itemTextFontSize,
  fontFamily: "Arial",
  textVisible: true,
  fillColor: "transparent",
};

export default Attribute;
