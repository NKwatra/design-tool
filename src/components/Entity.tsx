import * as React from "react";
import { Rect, Text } from "react-konva";
import { DispatchType } from "../lib/hooks";
import theme from "../lib/theme";
import { IItem } from "../types/item";
import Draggable from "./Draggable";

export type EntityProps = {
  /** width of entity */
  width?: number;
  /** height of entity */
  height?: number;
  /** x position of entity */
  x: number;
  /** y position of entity */
  y: number;
  /** border color of entity */
  stroke?: string;
  /** border width of entity */
  strokeWidth?: number;
  /** Name of the entity*/
  name?: string;
  /** color to use for name */
  nameColor?: string;
  /** width of text to use for name */
  nameWidth?: number;
  /** whether it is a weak entity or not */
  weakEntity?: boolean;
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
};

const Entity: React.FC<EntityProps> = ({
  width = 200,
  height = 100,
  x,
  y,
  stroke = theme.itemDefaultColor,
  strokeWidth = theme.itemStrokeDefaultWidth,
  name,
  nameColor = theme.itemTextDefaultColor,
  nameWidth,
  weakEntity,
  id,
  dispatch,
  selectedItem,
  rotation,
  fontSize = theme.itemTextFontSize,
  bold,
  italic,
  underlined,
}) => {
  const text = name ? name : weakEntity ? "Weak Entity" : "Entity";
  return (
    <Draggable
      x={x}
      y={y}
      width={width}
      height={height}
      id={id}
      dispatch={dispatch}
      isSelected={selectedItem?.item?.id === id}
      rotation={rotation}
      type="entity"
    >
      <Rect
        width={width}
        height={height}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Text
        width={width}
        height={height}
        verticalAlign="middle"
        align="center"
        stroke={nameColor}
        strokeWidth={
          nameWidth || !bold ? strokeWidth * 0.25 : strokeWidth * 0.75
        }
        text={text}
        fontSize={fontSize}
        textDecoration={underlined ? "underline" : undefined}
        fontStyle={italic ? "italic" : undefined}
      />
      {weakEntity ? (
        <Rect
          width={width - 10}
          height={height - 10}
          stroke={stroke}
          strokeWidth={strokeWidth}
          x={5}
          y={5}
        />
      ) : null}
    </Draggable>
  );
};

Entity.defaultProps = {
  width: 200,
  height: 100,
  stroke: theme.itemDefaultColor,
  strokeWidth: theme.itemStrokeDefaultWidth,
  nameColor: theme.itemTextDefaultColor,
  fontSize: theme.itemTextFontSize,
};

export default Entity;
