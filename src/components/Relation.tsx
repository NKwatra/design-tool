import * as React from "react";
import { RegularPolygon, Text } from "react-konva";
import theme from "../lib/theme";
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
}) => {
  const text = name
    ? name
    : identifying
    ? "Weak \nRelationship"
    : "Relationship";
  return (
    <Draggable x={x} y={y} width={2 * radius} height={2 * radius} id={id}>
      <RegularPolygon
        sides={4}
        radius={radius}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Text
        width={2 * radius}
        height={2 * radius}
        text={text}
        x={-radius}
        y={text === "Weak \nRelationship" ? -radius / 4 : -radius / 8}
        stroke={nameColor || stroke}
        strokeWidth={nameWidth || strokeWidth * 0.25}
        align="center"
        fontSize={theme.itemTextFontSize}
      />
      {identifying ? (
        <RegularPolygon
          sides={4}
          radius={radius - 5}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ) : null}
    </Draggable>
  );
};

Relation.defaultProps = {
  radius: 70,
  stroke: theme.itemDefaultColor,
  strokeWidth: theme.itemStrokeDefaultWidth,
};

export default Relation;
