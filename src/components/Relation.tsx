import type { KonvaEventObject } from "konva/types/Node";
import * as React from "react";
import { Circle, RegularPolygon, Text } from "react-konva";
import { DispatchType } from "../lib/hooks";
import theme from "../lib/theme";
import { startDrawing, updateItem } from "../redux/slice/diagram";
import { IItem } from "../types/item";
import Draggable from "./Draggable";

export type RelationProps = {
  /**
   *  Radius for diamond, the width of diamond woulb be 2 X radius
   */
  radius?: number;
  /**
   * Stroke color for the diamond
   */
  stroke?: string;
  /**
   * Strok width of the diamond.
   */
  strokeWidth?: number;
  /**
   * x position of diamond
   */
  x: number;
  /**
   * y position of diamond
   */
  y: number;
  /**
   * If this is an identifying relationship
   */
  identifying?: boolean;
  /**
   * Name of relationship
   */
  name?: string;
  /** color to use for name */
  nameColor?: string;
  /** width of text to use for name */
  nameWidth?: number;
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
  /**
   * function to send patches, when a connector is clicked
   */
  onDraw: (payload: { id: string; points: number[] }) => void;
};

const Relation: React.FC<RelationProps> = ({
  radius = 70,
  stroke = theme.itemDefaultColor,
  strokeWidth = theme.itemStrokeDefaultWidth,
  x,
  y,
  identifying,
  name,
  nameColor,
  nameWidth,
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
  onDraw,
}) => {
  const text = name
    ? name
    : identifying
    ? "Weak \nRelationship"
    : "Relationship";
  let fontStyle = "";
  if (bold) {
    fontStyle += "bold";
  }
  if (italic) {
    fontStyle += " italic";
  }

  const positions = [
    { x: (-3 * radius) / 4, y: -radius / 4 },
    { x: (-3 * radius) / 4, y: radius / 4 },
    { x: -radius / 4, y: (-3 * radius) / 4 },
    { x: -radius / 4, y: (3 * radius) / 4 },
    { x: (3 * radius) / 4, y: radius / 4 },
    { x: (3 * radius) / 4, y: -radius / 4 },
    { x: radius / 4, y: (-3 * radius) / 4 },
    { x: radius / 4, y: (3 * radius) / 4 },
  ];

  function handleMouseEnterOnConnector(e: KonvaEventObject<MouseEvent>) {
    const container = e.target!.getStage()!.container();
    container.style.cursor = "pointer";
  }

  function handleMouseLeaveOnConnector(e: KonvaEventObject<MouseEvent>) {
    const container = e.target!.getStage()!.container();
    container.style.cursor = "auto";
  }

  function handleClickOnConnector(e: KonvaEventObject<MouseEvent>) {
    let { clientX, clientY } = e.evt;
    clientX -= 182;
    clientY -= 166;

    const data = {
      id: Date.now().toString(),
      points: [clientX, clientY],
    };
    onDraw(data);
    dispatch(startDrawing(data));
  }

  return (
    <>
      <Draggable
        x={x}
        y={y}
        width={2 * radius}
        height={radius}
        id={id}
        dispatch={dispatch}
        isSelected={selectedItem?.item?.id === id}
        rotation={rotation}
        type="relation"
        onDrag={onDrag}
      >
        {identifying ? (
          <RegularPolygon
            sides={4}
            radius={radius - 5}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        ) : null}
        <RegularPolygon
          sides={4}
          radius={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill={fillColor}
        />
        {textVisible && (
          <Text
            width={2 * radius}
            height={radius}
            text={text}
            x={-radius}
            y={text === "Weak \nRelationship" ? -radius / 4 : -radius / 8}
            fill={nameColor || stroke}
            strokeWidth={nameWidth || strokeWidth * 0.25}
            align="center"
            fontSize={fontSize}
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
      </Draggable>
      {selectedItem?.item?.id === id &&
        positions.map((position, index) => (
          <Circle
            x={x + position.x}
            y={y + position.y}
            key={(position.x * index + position.y * (index + 1)).toString()}
            radius={4}
            fill="red"
            onMouseEnter={handleMouseEnterOnConnector}
            onMouseLeave={handleMouseLeaveOnConnector}
            hitStrokeWidth={8}
            onClick={handleClickOnConnector}
          />
        ))}
    </>
  );
};

Relation.defaultProps = {
  radius: 70,
  stroke: theme.itemDefaultColor,
  strokeWidth: theme.itemStrokeDefaultWidth,
  fontSize: theme.itemTextFontSize,
  fontFamily: "Arial",
  textVisible: true,
  fillColor: "transparent",
};

export default Relation;
